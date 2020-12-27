import {AnalyzeResult} from "../Data/AnalyzeResult";
import {VariableType} from "../Data/VariableType";

export class GLSLCutCodeGenerator {
    static Generate:(result:AnalyzeResult) => string = (result:AnalyzeResult) => {
        let code = "";
        let targetDepth = result.depthMap[result.depthMapIndex].depth;

        for(let i = 0; i <= result.depthMapIndex; i++){
            code += result.depthMap[i].src;
        }
        if(result.depthMapIndex != result.depthMap.length){
            for(let i = result.depthMapIndex + 1;i < result.depthMap.length; i++){
                if(result.depthMap[i].depth < targetDepth){
                    break;
                }else{
                    code += result.depthMap[i].src;
                }
            }
        }
        code += GLSLCutCodeGenerator.GenerateSuffixCode("vec3","hoge");
        return code;
    };

    static GenerateSuffixCode:(variableType:VariableType,variableName:string) => string = (variableType:VariableType,variableName:string) => {
        switch (variableType) {
            case "int":
                return `gl_FragColor.xyz = vec3(${variableName});`;
                break;
            case "float":
                return `gl_FragColor = vec4(${variableName},1.0,1.0,1.0);`;
                break;
            case "vec2":
                return `gl_FragColor = vec4(${variableName},1.0,1.0);`;
                break;
            case "vec3":
                return `gl_FragColor = vec4(${variableName},1.0);`;
                break;
            case "vec4":
                return `gl_FragColor = vec4(${variableName});`;
                break;
        }
    };
}
