import { useState, useMemo, useCallback } from 'react';
import BezoutScene from './components/BezoutScene';
import { findBezoutSolutions } from './utils/math';

function App() {
  const [a, setA] = useState(12);
  const [b, setB] = useState(8);
  const [range, setRange] = useState(10);
  const [showInfo, setShowInfo] = useState(true);

  const result = useMemo(() => findBezoutSolutions(a, b, range), [a, b, range]);

  const handleA = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setA(parseInt(e.target.value) || 0);
  }, []);

  const handleB = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setB(parseInt(e.target.value) || 0);
  }, []);

  return (
    <div className="w-screen h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex-shrink-0 bg-slate-800/90 backdrop-blur border-b border-slate-700/50 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">∃</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg leading-tight">Bézout's Identity Visualizer</h1>
            <p className="text-slate-400 text-xs">∃x,y ∈ ℤ : ax + by = gcd(a,b)</p>
          </div>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-slate-400 hover:text-white transition-colors text-sm px-3 py-1 rounded-md hover:bg-slate-700"
        >
          {showInfo ? 'Hide Panel' : 'Show Panel'}
        </button>
      </div>

      <div className="flex-1 flex relative">
        {/* 3D Canvas */}
        <div className="flex-1 relative">
          <BezoutScene
            a={a}
            b={b}
            g={result.g}
            solutions={result.solutions}
            range={range}
          />

          {/* Legend overlay */}
          <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur rounded-lg p-3 text-xs space-y-1.5 border border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-indigo-500/50 border border-indigo-400"></div>
              <span className="text-slate-300">Surface: z = {a}x + {b}y</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-amber-400/40 border border-amber-400"></div>
              <span className="text-slate-300">Plane: z = {result.g} (gcd)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 rounded bg-amber-400"></div>
              <span className="text-slate-300">Solution line: {a}x + {b}y = {result.g}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-slate-300">Integer solutions (x, y)</span>
            </div>
          </div>

          {/* Controls overlay on canvas */}
          <div className="absolute top-4 left-4 text-slate-400 text-xs">
            Drag to rotate · Scroll to zoom · Right-click to pan
          </div>
        </div>

        {/* Side Panel */}
        {showInfo && (
          <div className="w-80 flex-shrink-0 bg-slate-800/95 backdrop-blur border-l border-slate-700/50 overflow-y-auto">
            <div className="p-5 space-y-6">
              {/* Input Controls */}
              <section>
                <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  Parameters
                </h2>

                <div className="space-y-4">
                  {/* Slider for a */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-slate-300 text-sm font-medium">a</label>
                      <input
                        type="number"
                        value={a}
                        onChange={handleA}
                        className="w-20 bg-slate-700 text-white text-sm rounded px-2 py-1 text-right border border-slate-600 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      value={a}
                      onChange={handleA}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-slate-500 text-xs mt-0.5">
                      <span>-30</span><span>0</span><span>30</span>
                    </div>
                  </div>

                  {/* Slider for b */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-slate-300 text-sm font-medium">b</label>
                      <input
                        type="number"
                        value={b}
                        onChange={handleB}
                        className="w-20 bg-slate-700 text-white text-sm rounded px-2 py-1 text-right border border-slate-600 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      value={b}
                      onChange={handleB}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-slate-500 text-xs mt-0.5">
                      <span>-30</span><span>0</span><span>30</span>
                    </div>
                  </div>

                  {/* Range slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-slate-300 text-sm font-medium">View Range</label>
                      <span className="text-slate-400 text-sm">±{range}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="25"
                      value={range}
                      onChange={(e) => setRange(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>
              </section>

              {/* Result display */}
              <section>
                <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  Result
                </h2>
                <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50 space-y-3">
                  <div className="text-center">
                    <div className="text-slate-400 text-xs mb-1">Equation</div>
                    <div className="text-white font-mono text-lg">
                      {a}x + {b}y = {result.g}
                    </div>
                  </div>
                  <div className="h-px bg-slate-700"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-slate-400 text-xs mb-1">gcd({a}, {b})</div>
                      <div className="text-amber-400 font-mono text-2xl font-bold">{result.g}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-400 text-xs mb-1">Solutions found</div>
                      <div className="text-orange-400 font-mono text-2xl font-bold">{result.solutions.length}</div>
                    </div>
                  </div>
                  {result.g > 0 && (
                    <>
                      <div className="h-px bg-slate-700"></div>
                      <div className="text-center">
                        <div className="text-slate-400 text-xs mb-1">Particular solution (x₀, y₀)</div>
                        <div className="text-indigo-300 font-mono text-base">
                          ({result.x0}, {result.y0})
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-400 text-xs mb-1">General solution</div>
                        <div className="text-slate-300 font-mono text-xs leading-relaxed">
                          x = {result.x0} + {b / result.g}t<br />
                          y = {result.y0} - {a / result.g}t
                        </div>
                        <div className="text-slate-500 text-xs mt-1">t ∈ ℤ</div>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Solutions list */}
              <section>
                <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                  Integer Solutions
                </h2>
                <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {result.solutions.length === 0 && (
                    <p className="text-slate-500 text-sm italic">No solutions in range</p>
                  )}
                  {result.solutions.map((sol, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-slate-900/40 rounded px-3 py-1.5 border border-slate-700/30 hover:border-orange-500/30 transition-colors"
                    >
                      <span className="text-slate-300 font-mono text-sm">
                        ({sol.x}, {sol.y})
                      </span>
                      <span className="text-slate-500 text-xs font-mono">
                        {a}·{sol.x} + {b}·{sol.y} = {a * sol.x + b * sol.y}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Theory */}
              <section>
                <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  Theory
                </h2>
                <div className="text-slate-400 text-xs leading-relaxed space-y-2">
                  <p>
                    <strong className="text-slate-300">Bézout's Identity</strong> states that for any integers a and b (not both zero),
                    there exist integers x and y such that:
                  </p>
                  <div className="bg-slate-900/60 rounded p-2 text-center font-mono text-slate-300">
                    ax + by = gcd(a, b)
                  </div>
                  <p>
                    The <strong className="text-slate-300">3D visualization</strong> shows:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>The <span className="text-indigo-400">surface</span> z = ax + by</li>
                    <li>The <span className="text-amber-400">horizontal plane</span> z = gcd(a,b)</li>
                    <li>Their <span className="text-amber-300">intersection line</span> is the solution set</li>
                    <li>The <span className="text-orange-400">glowing spheres</span> are integer solutions</li>
                  </ul>
                  <p>
                    The <strong className="text-slate-300">Extended Euclidean Algorithm</strong> finds
                    the particular solution (x₀, y₀), and all other solutions are generated
                    by adding multiples of (b/g, −a/g).
                  </p>
                </div>
              </section>

              {/* Quick presets */}
              <section>
                <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Presets
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { a: 12, b: 8, label: '12, 8' },
                    { a: 7, b: 5, label: '7, 5' },
                    { a: 15, b: 10, label: '15, 10' },
                    { a: 3, b: 7, label: '3, 7' },
                    { a: 21, b: 14, label: '21, 14' },
                    { a: 17, b: 13, label: '17, 13' },
                    { a: -6, b: 9, label: '-6, 9' },
                    { a: 24, b: 18, label: '24, 18' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => { setA(preset.a); setB(preset.b); }}
                      className="text-xs bg-slate-700/50 text-slate-300 rounded-md px-3 py-2 hover:bg-slate-600/50 hover:text-white transition-colors border border-slate-600/30"
                    >
                      a={preset.a}, b={preset.b}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
