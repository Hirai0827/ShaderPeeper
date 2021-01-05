import {GLSLPeepAnalyzer} from "../ShaderPeeper_Core/Controller/GLSLPeepAnalyzer";
import {GLSLPeepCodeGenerator} from "../ShaderPeeper_Core/Controller/GLSLPeepCodeGenerator";
import {ShaderPeeperRegex} from "../ShaderPeeper_Core/Data/ShaderPeeperRegex";

test("analyze test",()=>{
    const code =
`
  vec3 col = vec3(uv,1.0);
  {vec2 col2 = vec2(0.5,1.0);
  float hoge = 0.0025;}
  float huga = 0.0125;
`;
    const a = GLSLPeepAnalyzer.Analyze(code,{row:2,column:6});
    console.log(a);
    if(a){
        expect(GLSLPeepCodeGenerator.Generate(a)).toBe(code);
    }
    const codeB = `
precision highp float;

uniform vec3 resolution;
uniform float time;

void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    uv.xy += sin(uv + time) * 0.5 + 0.5;
    gl_FragColor = vec4(uv, cos(time) * 0.5 + 0.5, 1.0);
}
`;
    const b = GLSLPeepAnalyzer.Analyze(codeB,{row:8,column:10});
    console.log(b);
    if(b){
        console.log(GLSLPeepCodeGenerator.Generate(b));
        expect(GLSLPeepCodeGenerator.Generate(b)).toBe(codeB);
    }

});
