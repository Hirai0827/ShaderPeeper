import {AnalyzeResult} from "../Data/AnalyzeResult";
import {CursorPos} from "../Data/CursorPos";
import {ShaderDepthMap} from "../Data/ShaderDepthData";
import {DefinitionData} from "../Data/DefinitionData";
import {ShaderCutterRegex} from "../Data/ShaderCutterRegex";
import {VariableType} from "../Data/VariableType";

export class GLSLAnalyzer{
    static Analyze:(src:string,cursorPos:CursorPos) => AnalyzeResult = (src:string,cursorPos:CursorPos) => {
        const index = GLSLAnalyzer.cursorPos2Index(src,cursorPos);
        const depthMap = GLSLAnalyzer.AnalyzeDepth(src);
        const depthIndex = GLSLAnalyzer.GetDepthMapIndex(depthMap,index);
        const definitionData = GLSLAnalyzer.AnalyzeLocalVariable(depthMap);

        return {
            src:src,cursorPos:cursorPos,index:index,depthMap:depthMap,depthMapIndex:depthIndex,definitionData:definitionData
        } as AnalyzeResult;
    };

    static SplitShader:(src:string) => {

    };

    static cursorPos2Index:(src:string,cursorPos:CursorPos) => number  = (src:string,cursorPos:CursorPos) => {
        //カーソル位置からindexを生成する
        const splited = src.split('\n');
        let count = 0;
        if(cursorPos.row != 0){
            for(let i = 0; i < cursorPos.row - 1; i++){
                count += splited[i].length;
            }
        }
        count += cursorPos.column;
        return count;
    };

    static AnalyzeDepth:(src:string) => ShaderDepthMap = (src:string) => {
        //Shaderのネスト深度を測る
        const analyzeDepth = [] as ShaderDepthMap;
        let buffer:string = "";
        let currentDepth = 0;
        for(let i = 0; i < src.length; i++){
            switch (src[i]) {
                case "{":
                    analyzeDepth.push({src:buffer + "{",depth:currentDepth});
                    buffer = "";
                    currentDepth++;
                    break;
                case "}":
                    analyzeDepth.push({src:buffer + "}",depth:currentDepth});
                    buffer = "";
                    currentDepth--;
                    break;
                case ";":
                    analyzeDepth.push({src:buffer + ";",depth:currentDepth});
                    buffer = "";
                    break;
                default:
                    buffer += src[i];
                    break;
            }
        }
        if(buffer != ""){
            analyzeDepth.push({src:buffer,depth:currentDepth});
        }
        return analyzeDepth;
    };

    static GetDepthMapIndex:(depthMap:ShaderDepthMap,index:number) => number = (depthMap:ShaderDepthMap,index:number) => {
        let count = 0;
        for(let i = 0; i < depthMap.length;i++){
            count += depthMap[i].src.length;
            if(count >= index){
                return i;
            }
        }
        return depthMap.length - 1;
    };
    static AnalyzeLocalVariable:(depthMap:ShaderDepthMap) => DefinitionData = (depthMap:ShaderDepthMap) => {
        //TODO ローカル変数の分析(対象変数の決定をするため)
        const definitionData:DefinitionData = {};
        for(let i = 0; i < depthMap.length; i++){
            const depthData = depthMap[i];
            const data = ShaderCutterRegex.defineRegex.exec(depthData.src);
            console.log(data);
            if(data){
                if(!definitionData[depthData.depth]){
                    definitionData[depthData.depth] = {};
                }
                definitionData[depthData.depth][data[2]] = data[1] as VariableType;
            }
        }
        return definitionData;
    };

}
