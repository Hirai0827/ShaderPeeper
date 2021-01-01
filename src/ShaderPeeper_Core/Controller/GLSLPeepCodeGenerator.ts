import {PeepAnalyzeResult} from "../Data/PeepAnalyzeResult";
import {VariableType} from "../Data/VariableType";
import {ShaderDepthData} from "../Data/ShaderDepthData";
import {DefinitionData} from "../Data/DefinitionData";
import {ShaderPeeperRegex} from "../Data/ShaderPeeperRegex";


type VariableTypeAndName = {type:VariableType,name:string};

export class GLSLPeepCodeGenerator {
    static Generate:(result:PeepAnalyzeResult) => string = (result:PeepAnalyzeResult) => {
        let code = "";
        let targetDepth = result.depthMap[result.depthMapIndex].depth;
        const variableInfo = GLSLPeepCodeGenerator.GetVariableTypeAndName(result.depthMap[result.depthMapIndex],result.definitionData);
        if(variableInfo == false){
            return "";
        }
        //コードをフラグメントから復元
        for(let i = 0; i <= result.depthMapIndex; i++){
            code += result.depthMap[i].src;
        }
        if(result.depthMapIndex != result.depthMap.length){
            if(targetDepth != 0){
                for(let i = result.depthMapIndex + 1;i < result.depthMap.length; i++){
                    if(result.depthMap[i].depth < targetDepth){
                        break;
                    }else{
                        code += result.depthMap[i].src;
                    }
                }
            }
        }

        code += "\n"+GLSLPeepCodeGenerator.GenerateSuffixCode(variableInfo.type,variableInfo.name);
        return result.splitShader.prefix + code + result.splitShader.suffix;
    };

    static GetVariableTypeAndName:(depthData:ShaderDepthData,definitionData:DefinitionData) => VariableTypeAndName|false = (depthData:ShaderDepthData,definitionData:DefinitionData) => {
        const definitionRegRes = ShaderPeeperRegex.defineRegex.exec(depthData.src);
        if(definitionRegRes){
            const type:VariableType = definitionRegRes[1] as VariableType;
            const name:string = definitionRegRes[2];
            return{type,name};
        }
        const substituteRegRes = ShaderPeeperRegex.substitutionRegex.exec(depthData.src);
        console.log(substituteRegRes);
        if(substituteRegRes){
            const name:string = substituteRegRes[1];
            for(let i = depthData.depth; i >= 0; i--){
                if(definitionData[i]){
                    if(definitionData[i][name]){
                        const type:VariableType = definitionData[i][name];
                        console.log(type,name);
                        return{type,name};
                    }
                }
            }
        }
        return false;
    };

    static GenerateSuffixCode:(variableType:VariableType,variableName:string) => string = (variableType:VariableType,variableName:string) => {
        switch (variableType) {
            case "int":
                return `gl_FragColor.xyz = vec3(${variableName});`;
                break;
            case "float":
                return `gl_FragColor = vec4(${variableName},0.0,0.0,1.0);`;
                break;
            case "vec2":
                return `gl_FragColor = vec4(${variableName},0.0,1.0);`;
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
