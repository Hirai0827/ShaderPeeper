export class ShaderPeeperRegex{
    static spaceRegex = new RegExp("\\s|\\t|\\n");
    static typeRegex = new RegExp("int|float|vec2|vec3");
    static equalRegex = new RegExp("(?:\\+=|-=|\\*=|/=|=)")
    static defineRegex = new RegExp(`(${ShaderPeeperRegex.typeRegex.source})(?:${ShaderPeeperRegex.spaceRegex.source}+?)((?:\\w|_)+)(?:${ShaderPeeperRegex.spaceRegex.source}*?)=`);
    static substitutionRegex = new RegExp(`((?:\\w|_)+)(?:|\\.\\w+)(?:${ShaderPeeperRegex.spaceRegex.source}*?)${ShaderPeeperRegex.equalRegex.source}`);
    static mainPartRegex = new RegExp(`void(?:${ShaderPeeperRegex.spaceRegex.source}+?)main(?:${ShaderPeeperRegex.spaceRegex.source}*?)\\(.*?\\)(?:${ShaderPeeperRegex.spaceRegex.source}*?){`);
}
