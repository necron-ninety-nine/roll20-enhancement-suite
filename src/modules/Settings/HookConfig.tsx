import { DOM } from "../../tools/DOM";
import { getExtUrlFromPage, strIsNullOrEmpty } from "../../tools/MiscUtils";
import { R20 } from "../../tools/R20";
import StringEdit from "./StringEdit";
import DropdownEdit from "./DropdownEdit";
import CheckboxEdit from "./CheckboxEdit";
import SliderEdit from "./SliderEdit";
import NumberEdit from "./NumberEdit";
import ColorEdit from "./ColorEdit";
import MouseButtonEdit from "./MouseButtonEdit";
import MediaWidget from "../../MediaWidget";
import EditComponentWrapper from "./EditComponentWrapper";

interface IMediaData {
    url: string;
    description: string;
}

export default class HookConfig extends DOM.ElementBase {
    private hook: any;
    private media: IMediaData[];

    public constructor(props) {
        super();

        this.hook = props.hook;
        if (this.hook.media) {
            this.media = [];

            for (const url in this.hook.media) {
                console.log(url);
                getExtUrlFromPage(url, 5000)
                    .then((e: string) => {
                        this.media.push({ url: e, description: this.hook.media[url] });
                        this.rerender();
                    })
                    .catch(err => console.error(`Failed to get ${url}: ${err}`));
            }
        }
    }

    protected internalRender = (): HTMLElement => {

        const elemMap = {
            "string": StringEdit,
            "dropdown": DropdownEdit,
            "checkbox": CheckboxEdit,
            "slider": SliderEdit,
            "number": NumberEdit,
            "color": ColorEdit,
            "mouse_button_index": MouseButtonEdit,
        };

        let elems = [];

        if (this.hook.configView) {
            for (let cfgId in this.hook.configView) {

                const cfg = this.hook.configView[cfgId];
                if (!(cfg.type in elemMap)) {
                    alert(`Unknown config type: ${cfg.type}`);
                    continue;
                }

                const Component = elemMap[cfg.type];
                elems.push(
                    <EditComponentWrapper
                        Component={Component}
                        cfgId={cfgId}
                        display={cfg.display}
                        hook={this.hook}
                    />
                );
            }
        }

        return (
            <div className="more-settings">

                {!strIsNullOrEmpty(this.hook.description) &&
                    <div>
                        <h3 title={this.hook.id + " " + this.hook.filename}>{this.hook.name}</h3>
                        <hr style={{ marginTop: "4px" }} />

                        <div className="r20es-indent description">
                            <p>{this.hook.description}</p>

                            {this.hook.gmOnly &&
                                <p>This module is only usable by GMs (which you {R20.isGM() ? "are" : "aren't"})</p>
                            }

                        </div>
                    </div>
                }

                {elems.length > 0 &&
                    <div>
                        <h3>Options</h3>
                        <hr style={{ marginTop: "4px" }} />

                        <ul className="r20es-indent">
                            {elems}
                        </ul>
                    </div>
                }

                {this.media &&

                    <div>
                        <h3>Media</h3>
                        <hr style={{ marginTop: "4px" }} />

                        {this.media.map(data => <MediaWidget url={data.url} description={data.description}/>)}
                    </div>
                }
            </div> as any
        );
    }
}
