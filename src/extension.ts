import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

const colorUtilities = ['bg-', 'text-', 'border-', 'ring-', 'divide-', 'placeholder-', 'from-', 'via-', 'to-', 'stroke-', 'fill-']

interface ConfigData {
    colors: { [key: string]: string };
    lightModeFirst: boolean;
}

const loadColorMapping = (workspacePath: string): ConfigData => {
    const configPath = path.join(workspacePath, '.tailwindDarkLightrc')
    if (fs.existsSync(configPath)) {
        try {
            const configContent = fs.readFileSync(configPath, 'utf8')
            return JSON.parse(configContent)
        } catch (error) {
            console.error('Error reading .tailwindDarkLightrc:', error)
        }
    }
    return { colors: {}, lightModeFirst: false } 
}

const watchConfigFile = (workspacePath: string, onUpdate: (newConfig: ConfigData) => void) => {
    const configPath = path.join(workspacePath, '.tailwindDarkLightrc')
    fs.watch(configPath, (eventType, filename) => {
        if (eventType === 'change') {
            console.log('Config file changed, reloading...')
            const newConfig = loadColorMapping(workspacePath)
            onUpdate(newConfig)
        }
    })
}


export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "tailwind-dark-light-autofill" is now active!')

    let config: ConfigData = { colors: {}, lightModeFirst: false }

    // Function to update the config
    const updateConfig = (newConfig: ConfigData) => {
        config = newConfig
        console.log('Config updated:', config)
    }

    const workspaceFolders = vscode.workspace.workspaceFolders
    if (workspaceFolders) {
        const workspacePath = workspaceFolders[0].uri.fsPath
        config = loadColorMapping(workspacePath)

        watchConfigFile(workspacePath, updateConfig)
    }

    let disposable = vscode.workspace.onDidChangeTextDocument((event) => {
        console.log('Document changed event fired')
        const editor = vscode.window.activeTextEditor
        if (editor && event.document === editor.document) {
            console.log('Processing change in active editor')
            const changes = event.contentChanges
            if (changes.length > 0) {
                const change = changes[0]
                
                // Check if the change is a space character
                if (change.text === ' ') {
                    const line = editor.document.lineAt(change.range.end.line)
                    const fullLineText = line.text 

                    const regexPattern = config.lightModeFirst
                        ? `(?<!dark:)(${colorUtilities.join('|')})([a-zA-Z0-9-]+-\\d{2,3})`
                        : `dark:(${colorUtilities.join('|')})([a-zA-Z0-9-]+-\\d{2,3})`
                    const regex = new RegExp(regexPattern, 'g')
                    console.log('Checking line:', fullLineText)
                    
                    let match
                    let edits: vscode.TextEdit[] = []
                    let processedUtilities = new Set()

                    while ((match = regex.exec(fullLineText)) !== null) {
                        console.log('Matched:', match[0])
                        const [fullMatch, utility, colorShade] = match
                        
                        // Skip if we've already processed this utility
                        if (processedUtilities.has(utility)) {
                            continue
                        }
                        
                        const pairedClass = config.colors[colorShade]
                        if (pairedClass) {
                            const fullPairedClass = config.lightModeFirst
                                ? `dark:${utility}${pairedClass}`
                                : `${utility}${pairedClass}`
                            console.log('Full paired class:', fullPairedClass)
                            
                            if (!fullLineText.includes(fullPairedClass)) {
                                const utilityRegex = new RegExp(`\\b${config.lightModeFirst ? 'dark:' : ''}${utility}[a-zA-Z0-9-]+\\b`)
                                if (!utilityRegex.test(fullLineText.replace(fullMatch, ''))) {
                                    console.log('Generating paired class for:', `${utility}${colorShade}`)
                                    const insertPosition = new vscode.Position(line.lineNumber, match.index + fullMatch.length)
                                    edits.push(vscode.TextEdit.insert(insertPosition, ` ${fullPairedClass}`))
                                    console.log('Queued paired class for insertion:', fullPairedClass)
                                    processedUtilities.add(utility)
                                } else {
                                    console.log('A class with the same utility already exists, skipping insertion.')
                                }
                            } else {
                                console.log('Paired class already present, skipping insertion.')
                            }
                        }
                    }
                    if (edits.length > 0) {
                        editor.edit(editBuilder => {
                            edits.forEach(edit => editBuilder.insert(edit.range.start, edit.newText))
                        }).then(success => {
                            if (success) {
                                console.log('All paired classes inserted successfully.')
                            } else {
                                console.log('Failed to insert some paired classes.')
                            }
                        })
                    }
                } else {
                    console.log('Change is not a space, skipping autofill.')
                }
            }
        }
    })

    context.subscriptions.push(disposable)
}

export const deactivate = () => {
    console.log('Extension "tailwind-dark-light-autofill" is being deactivated')
}
