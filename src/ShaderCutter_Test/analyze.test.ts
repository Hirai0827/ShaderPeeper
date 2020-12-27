import {GLSLAnalyzer} from "../ShaderCutter_Core/Controller/GLSLAnalyzer";
import {GLSLCutCodeGenerator} from "../ShaderCutter_Core/Controller/GLSLCutCodeGenerator";
import {ShaderCutterRegex} from "../ShaderCutter_Core/Data/ShaderCutterRegex";

test("analyze test",()=>{
    const code =
`
  vec3 col = vec3(uv,1.0);
`;
    const a = GLSLAnalyzer.Analyze(code,{row:0,column:6});
    console.log(ShaderCutterRegex.defineRegex);
    console.log(a);
    expect(GLSLCutCodeGenerator.Generate(a)).toBe(code);
});
