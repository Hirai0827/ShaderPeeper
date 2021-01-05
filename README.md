# GLSLibrary
<img src="https://img.shields.io/badge/npm-preparing-dddddd.svg?longCache=true">
<img src="https://img.shields.io/badge/yarn-preparing-dddddd.svg?longCache=true">

## About
ShaderPeeper is the package that generate variable-rendering glsl code.
It enable us debugging parameter in main function.
## Feature
- enable us to renering-debug of variable in main function.
- generate glsl-code which render variable with cursor position.
[![Image from Gyazo](https://i.gyazo.com/45010fc431f1a978c901d727a77ae55c.gif)](https://gyazo.com/45010fc431f1a978c901d727a77ae55c)
## Usage
- Install
```bash
yarn add  https://github.com/Hirai0827/ShaderCutter
```
when the package is installed, compile from ts to js will automatically begin.
- Use
```typescript
    const a = GLSLPeepAnalyzer.Analyze(code,{row:2,column:6});
    if(a){
        const generated = GLSLPeepCodeGenerator.Generate(a);
    }
```
## Contact
If you have something about the project please contact us
- Hirai0827([@lucknknock](https://twitter.com/lucknknock))
<a href="https://gyazo.com/59f3c7234410054b27441adae39f6dae"><img src="https://i.gyazo.com/59f3c7234410054b27441adae39f6dae.png" alt="Image from Gyazo" width="400"/></a>
