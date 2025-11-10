import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  Calculator, TrendingUp, BarChart3, Grid3x3, 
  Play, RefreshCcw, Download, Zap
} from "lucide-react";

const MathsLAB = () => {
  const [activeTab, setActiveTab] = useState("algebra");
  
  // Algebra state
  const [algebraEquation, setAlgebraEquation] = useState("x^2 - 4x + 3");
  const [algebraRange, setAlgebraRange] = useState({ min: -5, max: 10 });
  
  // Calculus state
  const [calculusFunction, setCalculusFunction] = useState("x^3 - 3x^2 + 2x");
  const [calculusRange, setCalculusRange] = useState({ min: -2, max: 4 });
  
  // Statistics state
  const [statsData, setStatsData] = useState<number[]>([23, 45, 12, 67, 34, 89, 56, 23, 45, 78]);
  const [newDataPoint, setNewDataPoint] = useState("");
  
  // Linear Algebra state
  const [matrixA, setMatrixA] = useState("[[2, 1], [1, 3]]");
  const [matrixB, setMatrixB] = useState("[[1, 0], [0, 1]]");

  // Simple polynomial evaluator
  const evaluatePolynomial = (expr: string, x: number): number => {
    try {
      const terms = expr.replace(/\s/g, '').split(/(?=[+-])/);
      let result = 0;
      
      for (const term of terms) {
        if (term.includes('x^3')) {
          const coef = term.replace('x^3', '') || '1';
          result += parseFloat(coef.replace('+', '')) * Math.pow(x, 3);
        } else if (term.includes('x^2')) {
          const coef = term.replace('x^2', '') || '1';
          result += parseFloat(coef.replace('+', '')) * Math.pow(x, 2);
        } else if (term.includes('x')) {
          const coef = term.replace('x', '') || '1';
          result += parseFloat(coef.replace('+', '')) * x;
        } else {
          result += parseFloat(term);
        }
      }
      
      return result;
    } catch {
      return 0;
    }
  };

  // Generate algebra graph data
  const algebraData = useMemo(() => {
    const data = [];
    const step = (algebraRange.max - algebraRange.min) / 100;
    
    for (let x = algebraRange.min; x <= algebraRange.max; x += step) {
      data.push({
        x: parseFloat(x.toFixed(2)),
        y: evaluatePolynomial(algebraEquation, x),
      });
    }
    
    return data;
  }, [algebraEquation, algebraRange]);

  // Generate calculus graph data (function and its derivative)
  const calculusData = useMemo(() => {
    const data = [];
    const step = (calculusRange.max - calculusRange.min) / 100;
    const h = 0.001;
    
    for (let x = calculusRange.min; x <= calculusRange.max; x += step) {
      const fx = evaluatePolynomial(calculusFunction, x);
      const derivative = (evaluatePolynomial(calculusFunction, x + h) - fx) / h;
      
      data.push({
        x: parseFloat(x.toFixed(2)),
        function: fx,
        derivative: derivative,
      });
    }
    
    return data;
  }, [calculusFunction, calculusRange]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const sorted = [...statsData].sort((a, b) => a - b);
    const mean = statsData.reduce((a, b) => a + b, 0) / statsData.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const variance = statsData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / statsData.length;
    const stdDev = Math.sqrt(variance);
    
    return {
      mean: mean.toFixed(2),
      median: median.toFixed(2),
      stdDev: stdDev.toFixed(2),
      min: Math.min(...statsData),
      max: Math.max(...statsData),
      count: statsData.length,
    };
  }, [statsData]);

  // Generate histogram data
  const histogramData = useMemo(() => {
    const bins = 10;
    const min = Math.min(...statsData);
    const max = Math.max(...statsData);
    const binSize = (max - min) / bins;
    
    const histogram = Array(bins).fill(0);
    statsData.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binSize), bins - 1);
      histogram[binIndex]++;
    });
    
    return histogram.map((count, i) => ({
      range: `${(min + i * binSize).toFixed(0)}-${(min + (i + 1) * binSize).toFixed(0)}`,
      count,
    }));
  }, [statsData]);

  const addDataPoint = () => {
    const value = parseFloat(newDataPoint);
    if (!isNaN(value)) {
      setStatsData([...statsData, value]);
      setNewDataPoint("");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              MathsLAB 🔢
            </h1>
            <p className="text-muted-foreground">
              Interactive mathematics visualization and equation solving
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Zap className="h-4 w-4 mr-2" />
            Real-time Graphing
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="algebra" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Algebra
            </TabsTrigger>
            <TabsTrigger value="calculus" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Calculus
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="linear" className="flex items-center gap-2">
              <Grid3x3 className="h-4 w-4" />
              Linear Algebra
            </TabsTrigger>
          </TabsList>

          {/* Algebra Tab */}
          <TabsContent value="algebra" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Equation Editor</CardTitle>
                  <CardDescription>Enter polynomial equations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Equation (e.g., x^2 - 4x + 3)</Label>
                    <Input
                      value={algebraEquation}
                      onChange={(e) => setAlgebraEquation(e.target.value)}
                      placeholder="x^2 - 4x + 3"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>X-axis Range</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={algebraRange.min}
                        onChange={(e) => setAlgebraRange({ ...algebraRange, min: parseFloat(e.target.value) })}
                        placeholder="Min"
                      />
                      <Input
                        type="number"
                        value={algebraRange.max}
                        onChange={(e) => setAlgebraRange({ ...algebraRange, max: parseFloat(e.target.value) })}
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <h4 className="font-semibold text-sm">Quick Examples:</h4>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setAlgebraEquation("x^2 - 4x + 3")}
                      >
                        Quadratic: x² - 4x + 3
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setAlgebraEquation("x^3 - 6x^2 + 11x - 6")}
                      >
                        Cubic: x³ - 6x² + 11x - 6
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setAlgebraEquation("2x^2 + 3x - 5")}
                      >
                        Parabola: 2x² + 3x - 5
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Function Graph</CardTitle>
                  <CardDescription>Real-time visualization of y = {algebraEquation}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={algebraData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="x" 
                        label={{ value: 'x', position: 'insideBottom', offset: -5 }}
                        className="text-muted-foreground"
                      />
                      <YAxis 
                        label={{ value: 'y', angle: -90, position: 'insideLeft' }}
                        className="text-muted-foreground"
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="y" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={false}
                        name={algebraEquation}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Calculus Tab */}
          <TabsContent value="calculus" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Function Input</CardTitle>
                  <CardDescription>Analyze derivatives</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Function f(x)</Label>
                    <Input
                      value={calculusFunction}
                      onChange={(e) => setCalculusFunction(e.target.value)}
                      placeholder="x^3 - 3x^2 + 2x"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>X-axis Range</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={calculusRange.min}
                        onChange={(e) => setCalculusRange({ ...calculusRange, min: parseFloat(e.target.value) })}
                        placeholder="Min"
                      />
                      <Input
                        type="number"
                        value={calculusRange.max}
                        onChange={(e) => setCalculusRange({ ...calculusRange, max: parseFloat(e.target.value) })}
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <h4 className="font-semibold text-sm">Example Functions:</h4>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setCalculusFunction("x^3 - 3x^2 + 2x")}
                      >
                        Cubic
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setCalculusFunction("x^2 - 2x + 1")}
                      >
                        Quadratic
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setCalculusFunction("2x^3 - 9x^2 + 12x")}
                      >
                        Complex Cubic
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Function & Derivative</CardTitle>
                  <CardDescription>Blue: f(x) | Orange: f'(x)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={calculusData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="x" 
                        label={{ value: 'x', position: 'insideBottom', offset: -5 }}
                        className="text-muted-foreground"
                      />
                      <YAxis 
                        label={{ value: 'y', angle: -90, position: 'insideLeft' }}
                        className="text-muted-foreground"
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="function" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={false}
                        name="f(x)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="derivative" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={2}
                        dot={false}
                        name="f'(x)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Data Input</CardTitle>
                  <CardDescription>Add and manage data points</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Add Data Point</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={newDataPoint}
                        onChange={(e) => setNewDataPoint(e.target.value)}
                        placeholder="Enter value"
                        onKeyPress={(e) => e.key === 'Enter' && addDataPoint()}
                      />
                      <Button onClick={addDataPoint}>
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Current Data ({statsData.length} points)</Label>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setStatsData([23, 45, 12, 67, 34, 89, 56, 23, 45, 78])}
                      >
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                    </div>
                    <ScrollArea className="h-32 border rounded-md p-2">
                      <div className="flex flex-wrap gap-2">
                        {statsData.map((value, index) => (
                          <Badge key={index} variant="secondary">
                            {value}
                          </Badge>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <div className="pt-4 space-y-2 border-t">
                    <h4 className="font-semibold text-sm">Statistics Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mean:</span>
                        <span className="font-mono">{statistics.mean}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Median:</span>
                        <span className="font-mono">{statistics.median}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Std Dev:</span>
                        <span className="font-mono">{statistics.stdDev}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min:</span>
                        <span className="font-mono">{statistics.min}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max:</span>
                        <span className="font-mono">{statistics.max}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Distribution Histogram</CardTitle>
                  <CardDescription>Frequency distribution of data</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={histogramData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="range" 
                        label={{ value: 'Value Range', position: 'insideBottom', offset: -5 }}
                        className="text-muted-foreground"
                      />
                      <YAxis 
                        label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
                        className="text-muted-foreground"
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="count" 
                        fill="hsl(var(--primary))" 
                        name="Frequency"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Linear Algebra Tab */}
          <TabsContent value="linear" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Matrix Operations</CardTitle>
                  <CardDescription>Input matrices in JSON format</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Matrix A</Label>
                    <Input
                      value={matrixA}
                      onChange={(e) => setMatrixA(e.target.value)}
                      placeholder="[[2, 1], [1, 3]]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Matrix B</Label>
                    <Input
                      value={matrixB}
                      onChange={(e) => setMatrixB(e.target.value)}
                      placeholder="[[1, 0], [0, 1]]"
                    />
                  </div>

                  <div className="pt-4 space-y-3">
                    <h4 className="font-semibold text-sm">Operations:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        A + B
                      </Button>
                      <Button variant="outline" size="sm">
                        A - B
                      </Button>
                      <Button variant="outline" size="sm">
                        A × B
                      </Button>
                      <Button variant="outline" size="sm">
                        A⁻¹
                      </Button>
                      <Button variant="outline" size="sm">
                        det(A)
                      </Button>
                      <Button variant="outline" size="sm">
                        A<sup>T</sup>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vector Visualization</CardTitle>
                  <CardDescription>2D vector space representation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        type="number" 
                        dataKey="x" 
                        domain={[-10, 10]}
                        label={{ value: 'x', position: 'insideBottom', offset: -5 }}
                        className="text-muted-foreground"
                      />
                      <YAxis 
                        type="number" 
                        dataKey="y" 
                        domain={[-10, 10]}
                        label={{ value: 'y', angle: -90, position: 'insideLeft' }}
                        className="text-muted-foreground"
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                      />
                      <Legend />
                      <Scatter 
                        name="Vector A" 
                        data={[{ x: 0, y: 0 }, { x: 3, y: 4 }]} 
                        fill="hsl(var(--primary))" 
                        line={{ stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                      />
                      <Scatter 
                        name="Vector B" 
                        data={[{ x: 0, y: 0 }, { x: -2, y: 5 }]} 
                        fill="hsl(var(--accent))" 
                        line={{ stroke: 'hsl(var(--accent))', strokeWidth: 2 }}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Eigenvalue & Eigenvector Calculator</CardTitle>
                <CardDescription>Compute eigenvalues and eigenvectors for square matrices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Grid3x3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter a square matrix above and click calculate to find eigenvalues and eigenvectors</p>
                  <Button className="mt-4" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Calculate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MathsLAB;
