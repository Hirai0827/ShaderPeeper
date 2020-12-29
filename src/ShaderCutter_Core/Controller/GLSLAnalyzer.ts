import {AnalyzeResult, SplitShader} from "../Data/AnalyzeResult";
import {CursorPos} from "../Data/CursorPos";
import {ShaderDepthMap} from "../Data/ShaderDepthData";
import {DefinitionData} from "../Data/DefinitionData";
import {ShaderCutterRegex} from "../Data/ShaderCutterRegex";
import {VariableType} from "../Data/VariableType";

export class GLSLAnalyzer{
    static Analyze:(src:string,cursorPos:CursorPos) => AnalyzeResult|false = (src:string,cursorPos:CursorPos) => {
        const splitCode = GLSLAnalyzer.SplitShader(src);
        if(!splitCode){
            return false;
        }
        const index = GLSLAnalyzer.cursorPos2Index(src,cursorPos) - splitCode.prefix.length;
        const depthMap = GLSLAnalyzer.AnalyzeDepth(splitCode.mainFunc);
        const depthIndex = GLSLAnalyzer.GetDepthMapIndex(depthMap,index);
        const definitionData = GLSLAnalyzer.AnalyzeLocalVariable(depthMap);

        return {
            src:src,cursorPos:cursorPos,splitShader:splitCode,index:index,depthMap:depthMap,depthMapIndex:depthIndex,definitionData:definitionData
        } as AnalyzeResult;
    };

    static SplitShader:(src:string) => SplitShader|false = (src:string) => {
        //TODO Shaderのメイン関数のみ分離 正規表現のprefixを利用する（予定）
        const mainPartRegRes = ShaderCutterRegex.mainPartRegex.exec(src);
        if(mainPartRegRes){
            const beginPoint = mainPartRegRes.index + mainPartRegRes[0].length;
            const prefix = src.substring(0,beginPoint);
            const mainAndSuff = src.substring(beginPoint,src.length);
            let bracketCount = 1;
            let endPoint  = mainAndSuff.length;
            for(let i = 0; i < mainAndSuff.length; i++){
                switch (mainAndSuff[i]) {
                    case '{':
                        bracketCount++;
                        break;
                    case '}':
                        bracketCount--;
                        break;
                }
                if(bracketCount == 0){
                    //ここまでメイン関数
                    endPoint = i;
                    break;
                }
            }
            const main = mainAndSuff.substring(0,endPoint);
            const suffix = mainAndSuff.substring(endPoint,mainAndSuff.length);
            //TODO main関数とSuffix部分の分離
            return {prefix:prefix,mainFunc:main,suffix:suffix};
        }else{
            return false;
        }
    };

    static cursorPos2Index:(src:string,cursorPos:CursorPos) => number  = (src:string,cursorPos:CursorPos) => {
        //カーソル位置からindexを生成する
        const splited = src.split('\n');
        let count = 0;
        if(cursorPos.row != 0){
            for(let i = 0; i < cursorPos.row; i++){
                count += splited[i].length + 1;
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
        definitionData[0] = {};
        definitionData[0]["gl_FragCoord"] = "vec4";
        definitionData[0]["gl_FragColor"] = "vec4";

        for(let i = 0; i < depthMap.length; i++){
            const depthData = depthMap[i];
            const data = ShaderCutterRegex.defineRegex.exec(depthData.src);
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
