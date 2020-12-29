import {GLSLAnalyzer} from "../ShaderCutter_Core/Controller/GLSLAnalyzer";
import {GLSLCutCodeGenerator} from "../ShaderCutter_Core/Controller/GLSLCutCodeGenerator";
import {ShaderCutterRegex} from "../ShaderCutter_Core/Data/ShaderCutterRegex";

test("analyze test",()=>{
    const code =
`
  vec3 col = vec3(uv,1.0);
  {vec2 col2 = vec2(0.5,1.0);
  float hoge = 0.0025;}
  float huga = 0.0125;
`;
    const a = GLSLAnalyzer.Analyze(code,{row:2,column:6});
    console.log(a);
    if(a){
        expect(GLSLCutCodeGenerator.Generate(a)).toBe(code);
    }
    const codeB = `#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

\tvec3 p = normalize(vec3(gl_FragCoord.xy / resolution.xy ,.5));

\t     p =  floor(p*52.0)/32.0;
\t
\tfloat color = fract((22.3+p.y)/p.z*2.6+time*2.8);
\t 

\tgl_FragColor = vec4( vec3( color,  color, sin( color + time / 2.0 ) * 2.75 ), 2.0 );
}
`;
    const b = GLSLAnalyzer.Analyze(codeB,{row:15,column:12});
    if(b){
        console.log(GLSLCutCodeGenerator.Generate(b));
        expect(GLSLCutCodeGenerator.Generate(b)).toBe(codeB);
    }

});
