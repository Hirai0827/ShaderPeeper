export class ShaderCutterRegex{
    static spaceRegex = new RegExp("\\s|\\t");
    static typeRegex = new RegExp("int|float|vec2|vec3");
    static defineRegex = new RegExp(`(${ShaderCutterRegex.typeRegex.source})(?:${ShaderCutterRegex.spaceRegex.source}+?)(\\w+)(?:${ShaderCutterRegex.spaceRegex.source}*?)=`);
    static substitutionRegex = new RegExp(`(\\w)+?(?:${ShaderCutterRegex.spaceRegex.source}*?)=`);
    static mainPartRegex = new RegExp(`void(?:${ShaderCutterRegex.spaceRegex.source}+?)main(?:${ShaderCutterRegex.spaceRegex.source}*?)\\(.*?\\)(?:${ShaderCutterRegex.spaceRegex.source}*?){`);
}
