import {VariableType} from "./VariableType";

export type DefinitionList = {[key:string]:VariableType};
export type DefinitionData = {[key:number]:DefinitionList};
