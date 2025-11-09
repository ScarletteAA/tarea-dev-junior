import * as fs from 'fs';

interface TestCase {
  panelW: number;
  panelH: number;
  roofW: number;
  roofH: number;
  expected: number;
}

interface TestData {
  testCases: TestCase[];
}

function calculatePanels(
  panelWidth: number,
  panelHeight: number,
  roofWidth: number,
  roofHeight: number
): number {
  const calculateFit = (w1: number, h1: number, w2: number, h2: number): number => 
    Math.floor(w2 / w1) * Math.floor(h2 / h1);

  const hybridFit = (pw: number, ph: number, rw: number, rh: number): number => {
    const base = calculateFit(pw, ph, rw, rh);
    const usedWidth = Math.floor(rw / pw) * pw;
    const usedHeight = Math.floor(rh / ph) * ph;
    const freeWidth = rw - usedWidth;
    const freeHeight = rh - usedHeight;
    const extra = Math.max(
      calculateFit(ph, pw, freeWidth, rh),
      calculateFit(pw, ph, rw, freeHeight)
    );
    return base + extra;
  };

  const normal = hybridFit(panelWidth, panelHeight, roofWidth, roofHeight);
  const rotated = hybridFit(panelHeight, panelWidth, roofWidth, roofHeight);
  
  return Math.max(normal, rotated);
}

function main(): void {
  console.log("🐕 Wuuf wuuf wuuf 🐕");
  console.log("================================\n");
  
  runTests();
}

function runTests(): void {
  const data: TestData = JSON.parse(fs.readFileSync('test_cases.json', 'utf-8'));
  const testCases = data.testCases;
  
  console.log("Corriendo tests:");
  console.log("-------------------");
  
  testCases.forEach((test: TestCase, index: number) => {
    const result = calculatePanels(test.panelW, test.panelH, test.roofW, test.roofH);
    const passed = result === test.expected;
    
    console.log(`Test ${index + 1}:`);
    console.log(`  Panels: ${test.panelW}x${test.panelH}, Roof: ${test.roofW}x${test.roofH}`);
    console.log(`  Expected: ${test.expected}, Got: ${result}`);
    console.log(`  Status: ${passed ? "✅ PASSED" : "❌ FAILED"}\n`);
  });
}

main();
