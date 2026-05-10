'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActivityDay {
  day: string;   // "YYYY-MM-DD"
  repos_count: number;
}

interface Cell {
  date: Date;
  dateStr: string;
  count: number;
  isFuture: boolean;
}

interface TooltipState {
  cell: Cell;
  x: number;
  y: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const authFetch = async (url: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  return fetch(`http://localhost:3001${url}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    },
  });
};

const toDateStr = (date: Date): string =>
  date.toISOString().split('T')[0];

const getColor = (count: number): string => {
  if (count === 0) return '#1a1a1a';
  if (count === 1) return 'rgba(34,197,94,0.25)';
  if (count <= 3)  return 'rgba(34,197,94,0.55)';
  return '#22c55e';
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CELL = 12;
const GAP  = 3;
const STEP = CELL + GAP;

// Build 52-week grid starting on the Monday on/before 364 days ago.
function buildGrid(activityMap: Record<string, number>): Cell[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // End on the Sunday of the current week (future days shown as transparent).
  // This guarantees today is always visible in the last column.
  const endSunday = new Date(today);
  const todayDow = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  endSunday.setDate(today.getDate() + (todayDow === 0 ? 0 : 7 - todayDow));

  // Start on the Monday exactly 363 days before that Sunday.
  // endSunday - 363 = endSunday - (51*7 + 6) = (endSunday - 6 days) - 51 weeks = Monday of current week - 51 weeks → always a Monday.
  const anchor = new Date(endSunday);
  anchor.setDate(endSunday.getDate() - 363);

  const weeks: Cell[][] = [];
  for (let w = 0; w < 52; w++) {
    const week: Cell[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(anchor);
      date.setDate(anchor.getDate() + w * 7 + d);
      const dateStr = toDateStr(date);
      week.push({
        date,
        dateStr,
        count: activityMap[dateStr] ?? 0,
        isFuture: date > today,
      });
    }
    weeks.push(week);
  }
  return weeks;
}

// Return the label and column index for each month that starts in a given week.
function getMonthLabels(weeks: Cell[][]): { label: string; col: number }[] {
  const seen = new Set<number>();
  const labels: { label: string; col: number }[] = [];
  weeks.forEach((week, w) => {
    week.forEach((cell) => {
      if (cell.date.getDate() === 1) {
        const m = cell.date.getMonth();
        if (!seen.has(m)) {
          seen.add(m);
          labels.push({ label: MONTH_NAMES[m], col: w });
        }
      }
    });
  });
  return labels;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="animate-pulse" style={{ width: 120, height: 18, background: '#1a1a1a', borderRadius: 6 }} />
        <div className="animate-pulse" style={{ width: 160, height: 14, background: '#1a1a1a', borderRadius: 6 }} />
      </div>
      <div className="animate-pulse" style={{ display: 'flex', gap: GAP, overflowX: 'auto' }}>
        {Array(52).fill(0).map((_, w) => (
          <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
            {Array(7).fill(0).map((_, d) => (
              <div key={d} style={{ width: CELL, height: CELL, borderRadius: 3, background: '#1a1a1a' }} />
            ))}
          </div>
        ))}
      </div>
      <div className="animate-pulse" style={{ width: 200, height: 12, background: '#1a1a1a', borderRadius: 6, alignSelf: 'flex-end' }} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ActivityGraphProps {
  userId: string;
}

export function ActivityGraph({ userId }: ActivityGraphProps) {
  const [weeks, setWeeks]       = useState<Cell[][]>([]);
  const [monthLabels, setMonthLabels] = useState<{ label: string; col: number }[]>([]);
  const [totalCount, setTotalCount]   = useState(0);
  const [isLoading, setIsLoading]     = useState(true);
  const [isEmpty, setIsEmpty]         = useState(false);
  const [tooltip, setTooltip]         = useState<TooltipState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await authFetch('/settings/activity');

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          console.error('[ActivityGraph] API error', res.status, errBody);
          throw new Error(`API ${res.status}: ${errBody?.message ?? 'unknown error'}`);
        }

        const raw: ActivityDay[] = await res.json();
        console.log('[ActivityGraph] raw response:', raw);

        const map: Record<string, number> = {};
        let total = 0;
        for (const row of raw) {
          // Supabase returns bigint as string in some drivers — coerce to number
          const count = Number(row.repos_count);
          map[row.day] = count;
          total += count;
        }
        console.log('[ActivityGraph] activity map:', map, 'total:', total);

        const grid = buildGrid(map);
        setWeeks(grid);
        setMonthLabels(getMonthLabels(grid));
        setTotalCount(total);
        setIsEmpty(total === 0);
      } catch (err) {
        console.error('[ActivityGraph] failed to load:', err);
        const grid = buildGrid({});
        setWeeks(grid);
        setMonthLabels(getMonthLabels(grid));
        setIsEmpty(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userId]);

  const handleMouseEnter = (cell: Cell, e: React.MouseEvent) => {
    if (cell.isFuture || !wrapperRef.current) return;
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const cellRect    = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({
      cell,
      x: cellRect.left - wrapperRect.left + cellRect.width / 2,
      y: cellRect.top  - wrapperRect.top,
    });
  };

  const handleMouseLeave = () => setTooltip(null);

  // Left offset for day labels column
  const DAY_LABEL_W = 28;

  if (isLoading) return <Skeleton />;

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={18} color="#22c55e" />
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#ffffff' }}>Activity</h2>
        </div>
        <span style={{ fontSize: 13, color: '#a1a1aa' }}>
          {totalCount} repo{totalCount !== 1 ? 's' : ''} explored this year
        </span>
      </div>

      {/* Graph — scrollable on mobile */}
      <div ref={containerRef} style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 4 }}>

          {/* Month labels row */}
          <div style={{ display: 'flex', marginLeft: DAY_LABEL_W, gap: 0, height: 16, position: 'relative' }}>
            {monthLabels.map(({ label, col }) => (
              <div
                key={label}
                style={{
                  position: 'absolute',
                  left: col * STEP,
                  fontSize: 11,
                  color: '#a1a1aa',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Day labels + grid */}
          <div style={{ display: 'flex', gap: 4 }}>

            {/* Day labels (Mon, Wed, Fri) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: GAP, width: DAY_LABEL_W - 4, paddingTop: 2 }}>
              {['Mon', '', 'Wed', '', 'Fri', '', ''].map((label, i) => (
                <div
                  key={i}
                  style={{ height: CELL, fontSize: 11, color: '#a1a1aa', display: 'flex', alignItems: 'center' }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Weeks grid */}
            <div style={{ display: 'flex', gap: GAP }}>
              {weeks.map((week, w) => (
                <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
                  {week.map((cell, d) => (
                    <div
                      key={d}
                      onMouseEnter={(e) => handleMouseEnter(cell, e)}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        width: CELL,
                        height: CELL,
                        borderRadius: 3,
                        background: cell.isFuture ? 'transparent' : getColor(cell.count),
                        cursor: cell.isFuture ? 'default' : 'default',
                        transition: 'background 150ms',
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Legend + total */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 13, color: '#a1a1aa' }}>
          {totalCount} repositories explored in the last year
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#a1a1aa' }}>Less</span>
          {[0, 1, 2, 4].map((count) => (
            <div
              key={count}
              style={{ width: CELL, height: CELL, borderRadius: 3, background: getColor(count) }}
            />
          ))}
          <span style={{ fontSize: 11, color: '#a1a1aa' }}>More</span>
        </div>
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div style={{ textAlign: 'center', paddingTop: 4 }}>
          <p style={{ fontSize: 13, color: '#52525b', marginBottom: 6 }}>
            No activity yet. Start exploring repositories!
          </p>
          <Link href="/explore" style={{ fontSize: 13, color: '#22c55e', textDecoration: 'none' }}>
            Explore Now →
          </Link>
        </div>
      )}

      {/* Tooltip — absolute relative to wrapper (fixed breaks inside CSS-animated ancestors) */}
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y - 8,
            transform: 'translate(-50%, -100%)',
            background: '#1a1a1a',
            border: '1px solid #27272a',
            borderRadius: 6,
            padding: '6px 10px',
            zIndex: 50,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {tooltip.cell.count === 0 ? (
            <p style={{ fontSize: 12, color: '#a1a1aa' }}>
              No activity on {formatDate(tooltip.cell.date)}
            </p>
          ) : (
            <>
              <p style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>
                {tooltip.cell.count} repo{tooltip.cell.count !== 1 ? 's' : ''} explored
              </p>
              <p style={{ fontSize: 12, color: '#a1a1aa' }}>
                {formatDate(tooltip.cell.date)}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
