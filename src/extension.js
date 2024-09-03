"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const darkToLightMap = {
    '900': '100',
    '800': '200',
    '700': '300',
    '600': '400',
    '500': '500',
    '400': '600',
    '300': '700',
    '200': '800',
    '100': '900',
};
const colorUtilities = ['bg-', 'text-', 'border-', 'ring-', 'divide-', 'placeholder-', 'from-', 'via-', 'to-'];
function activate(context) {
    console.log('Congratulations, your extension "tailwind-dark-light-autofill" is now active!');
    let disposable = vscode.workspace.onDidChangeTextDocument((event) => {
        console.log('here 1');
        const editor = vscode.window.activeTextEditor;
        if (editor && event.document === editor.document) {
            console.log('here 2');
            const changes = event.contentChanges;
            if (changes.length > 0) {
                console.log('here 3');
                const change = changes[0];
                const line = editor.document.lineAt(change.range.end.line);
                const lineText = line.text.substring(0, change.range.end.character);
                const match = lineText.match(/dark:(bg-|text-|border-|ring-|divide-|placeholder-|from-|via-|to-)([\w-]+)-(\d{3})\s*$/);
                if (match) {
                    console.log('here 4');
                    const [, utility, color, shade] = match;
                    const lightShade = darkToLightMap[shade];
                    if (lightShade) {
                        console.log('here 5');
                        const lightClass = `${utility}${color}-${lightShade}`;
                        editor.edit((editBuilder) => {
                            editBuilder.insert(change.range.end, ` ${lightClass}`);
                            console.log('here 6');
                        });
                    }
                }
            }
        }
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map