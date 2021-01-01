import {CursorPos} from "./CursorPos";
import {VariableType} from "./VariableType";
import {ShaderDepthData, ShaderDepthMap} from "./ShaderDepthData";
import {DefinitionData} from "./DefinitionData";

export type SplitShader = {
    prefix:string,
    mainFunc:string,
    suffix:string
}

export type PeepAnalyzeResult = {
    src:string;
    splitShader:SplitShader;
    cursorPos:CursorPos;
    index:number;
    depthMap:ShaderDepthMap;
    depthMapIndex:number;
    variableType:VariableType;
    definitionData:DefinitionData;
}
