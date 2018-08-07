import { R20Module } from "../tools/r20Module";
import { R20 } from "../tools/r20api";

class InitiativeAdvanceShortcutModule extends R20Module.OnAppLoadBase {

    setup() {
        if (!R20.isGM()) return;

        const advance = _ => R20.advanceInitiative();

        Mousetrap.bind("ctrl+right", advance);
        Mousetrap.bind("meta+right", advance);
    }

    dispose() {
        Mousetrap.unbind("ctrl+right");
        Mousetrap.unbind("meta+right");
    }
}

if (R20Module.canInstall()) new InitiativeAdvanceShortcutModule(__filename).install();

const hook = {
    id: "initiativeShortcuts",
    name: "Initiative shortcuts",
    description: "Creates a shortcut for advancing (Ctrl+Right Arrow) in the initiative list.",
    category: R20Module.category.initiative,
    gmOnly: true,

};

export { hook as InitiativeAdvanceShortcutHook };
