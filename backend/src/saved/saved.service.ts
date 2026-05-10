import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import type {
  Collection,
  CreateCollectionDto,
  MoveToCollectionDto,
  SavedRepo,
  SaveRepoDto,
  UpdateRepoStatusDto,
} from './saved.interfaces';

const STATUS_FILTERS = ['want_to_contribute', 'in_progress', 'completed'];

@Injectable()
export class SavedService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getSavedRepos(
    userId: string,
    collectionId?: string,
    page = 1,
    limit = 10,
  ): Promise<{ repos: SavedRepo[]; total: number; page: number; totalPages: number }> {
    const supabase = this.supabaseService.getdb();
    const offset = (page - 1) * limit;

    let query = supabase
      .from('saved_repos')
      .select('*, collections(name)', { count: 'exact' })
      .eq('user_id', userId)
      .order('saved_at', { ascending: false });

    if (collectionId && collectionId !== 'all') {
      if (STATUS_FILTERS.includes(collectionId)) {
        query = query.eq('status', collectionId);
      } else {
        query = query.eq('collection_id', collectionId);
      }
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw new BadRequestException(error.message);

    const repos: SavedRepo[] = (data ?? []).map((row: any) => ({
      id: row.id,
      repo_id: row.repo_id,
      repo_data: row.repo_data,
      status: row.status,
      collection_id: row.collection_id ?? null,
      collection_name: row.collections?.name ?? null,
      saved_at: row.saved_at,
    }));

    const total = count ?? 0;

    return { repos, total, page, totalPages: Math.ceil(total / limit) };
  }

  async saveRepo(userId: string, data: SaveRepoDto): Promise<SavedRepo> {
    const supabase = this.supabaseService.getdb();

    const { data: saved, error } = await supabase
      .from('saved_repos')
      .upsert(
        {
          user_id: userId,
          repo_id: data.repo_id,
          repo_data: data.repo_data,
          collection_id: data.collection_id ?? null,
          status: 'want_to_contribute',
        },
        { onConflict: 'user_id,repo_id' },
      )
      .select('*, collections(name)')
      .single();

    if (error) throw new BadRequestException(error.message);

    return {
      id: saved.id,
      repo_id: saved.repo_id,
      repo_data: saved.repo_data,
      status: saved.status,
      collection_id: saved.collection_id ?? null,
      collection_name: (saved as any).collections?.name ?? null,
      saved_at: saved.saved_at,
    };
  }

  async removeRepo(userId: string, repoId: number): Promise<{ success: boolean }> {
    const supabase = this.supabaseService.getdb();

    const { error, count } = await supabase
      .from('saved_repos')
      .delete({ count: 'exact' })
      .eq('user_id', userId)
      .eq('repo_id', repoId);

    if (error) throw new BadRequestException(error.message);
    if (!count) throw new NotFoundException('Saved repo not found');

    return { success: true };
  }

  async updateStatus(
    userId: string,
    repoId: number,
    data: UpdateRepoStatusDto,
  ): Promise<SavedRepo> {
    const supabase = this.supabaseService.getdb();

    const { data: updated, error } = await supabase
      .from('saved_repos')
      .update({ status: data.status })
      .eq('user_id', userId)
      .eq('repo_id', repoId)
      .select('*, collections(name)')
      .single();

    if (error || !updated) throw new NotFoundException('Saved repo not found');

    return {
      id: updated.id,
      repo_id: updated.repo_id,
      repo_data: updated.repo_data,
      status: updated.status,
      collection_id: updated.collection_id ?? null,
      collection_name: (updated as any).collections?.name ?? null,
      saved_at: updated.saved_at,
    };
  }

  async moveToCollection(
    userId: string,
    repoId: number,
    data: MoveToCollectionDto,
  ): Promise<SavedRepo> {
    const supabase = this.supabaseService.getdb();

    const { data: updated, error } = await supabase
      .from('saved_repos')
      .update({ collection_id: data.collection_id })
      .eq('user_id', userId)
      .eq('repo_id', repoId)
      .select('*, collections(name)')
      .single();

    if (error || !updated) throw new NotFoundException('Saved repo not found');

    return {
      id: updated.id,
      repo_id: updated.repo_id,
      repo_data: updated.repo_data,
      status: updated.status,
      collection_id: updated.collection_id ?? null,
      collection_name: (updated as any).collections?.name ?? null,
      saved_at: updated.saved_at,
    };
  }

  async getCollections(userId: string): Promise<Collection[]> {
    const supabase = this.supabaseService.getdb();

    const [{ count: totalCount }, { count: wantCount }, { count: inProgressCount }, { count: completedCount }] =
      await Promise.all([
        supabase.from('saved_repos').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('saved_repos').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'want_to_contribute'),
        supabase.from('saved_repos').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'in_progress'),
        supabase.from('saved_repos').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'completed'),
      ]);

    const { data: userCollections } = await supabase
      .from('collections')
      .select('*, saved_repos(count)')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    const defaultCollections: Collection[] = [
      { id: 'all', name: 'All Saved', count: totalCount ?? 0, isDefault: true },
      { id: 'want_to_contribute', name: 'Want to Contribute', count: wantCount ?? 0, isDefault: true },
      { id: 'in_progress', name: 'In Progress', count: inProgressCount ?? 0, isDefault: true },
      { id: 'completed', name: 'Completed', count: completedCount ?? 0, isDefault: true },
    ];

    const customCollections: Collection[] = (userCollections ?? []).map((c: any) => ({
      id: c.id,
      name: c.name,
      count: c.saved_repos?.[0]?.count ?? 0,
      isDefault: false,
      created_at: c.created_at,
    }));

    return [...defaultCollections, ...customCollections];
  }

  async createCollection(userId: string, data: CreateCollectionDto): Promise<Collection> {
    if (!data.name || data.name.trim().length === 0) {
      throw new BadRequestException('Collection name cannot be empty');
    }
    if (data.name.trim().length > 30) {
      throw new BadRequestException('Collection name must be 30 characters or less');
    }

    const supabase = this.supabaseService.getdb();

    const { data: collection, error } = await supabase
      .from('collections')
      .insert({ user_id: userId, name: data.name.trim() })
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);

    return {
      id: collection.id,
      name: collection.name,
      count: 0,
      isDefault: false,
      created_at: collection.created_at,
    };
  }

  async deleteCollection(userId: string, collectionId: string): Promise<{ success: boolean }> {
    const supabase = this.supabaseService.getdb();

    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', collectionId)
      .eq('user_id', userId);

    if (error) throw new BadRequestException(error.message);

    return { success: true };
  }

  async isRepoSaved(
    userId: string,
    repoId: number,
  ): Promise<{ saved: boolean; status?: string; collection_id?: string | null }> {
    const supabase = this.supabaseService.getdb();

    const { data, error } = await supabase
      .from('saved_repos')
      .select('id, status, collection_id')
      .eq('user_id', userId)
      .eq('repo_id', repoId)
      .single();

    if (error || !data) return { saved: false };

    return { saved: true, status: data.status, collection_id: data.collection_id ?? null };
  }
}
