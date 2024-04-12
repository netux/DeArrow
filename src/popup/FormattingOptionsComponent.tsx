import * as React from "react";
import Config, { ThumbnailFallbackOption } from "../config/config";
import { TitleFormatting } from "../../title-formatting/src";
import { toFirstLetterUppercase, toLowerCaseTitle, toSentenceCase } from "../../title-formatting/src/formatters";
import { SelectOptionComponent } from "./SelectOptionComponent";
import { ToggleOptionComponent } from "./ToggleOptionComponent";

interface FormattingOptionsComponentProps {
    titleFormatting?: TitleFormatting;
    setTitleFormatting?: (value: TitleFormatting) => void;
}

export const FormattingOptionsComponent = ({
    titleFormatting,
    setTitleFormatting
}: FormattingOptionsComponentProps) => {
    if (!titleFormatting && !setTitleFormatting) {
        [titleFormatting, setTitleFormatting] = React.useState(Config.config!.titleFormatting);
    }

    const [shouldCleanEmojis, setShouldCleanEmojis] = React.useState(Config.config!.shouldCleanEmojis);
    const [onlyTitleCaseInEnglish, setOnlyTitleCaseInEnglish] = React.useState(Config.config!.onlyTitleCaseInEnglish);
    const [thumbnailFallback, setThumbnailFallback] = React.useState(String(Config.config!.thumbnailFallback));
    const [thumbnailFallbackAutogenerated, setThumbnailFallbackAutogenerated] = React.useState(String(Config.config!.thumbnailFallbackAutogenerated));
    const [showLiveCover, setShowLiveCover] = React.useState(Config.config!.showLiveCover);

    const [sentenceCaseText, setSentenceCaseText] = React.useState(chrome.i18n.getMessage("SentenceCase"));
    const [lowerCaseText, setLowerCaseText] = React.useState(chrome.i18n.getMessage("LowerCase"));
    const [firstLetterUppercaseText, setFirstLetterUppercaseText] = React.useState(chrome.i18n.getMessage("FirstLetterUppercase"));
    React.useEffect(() => {
        (async () => {
            setSentenceCaseText(await toSentenceCase(chrome.i18n.getMessage("SentenceCase"), false));
            setLowerCaseText(await toLowerCaseTitle(chrome.i18n.getMessage("LowerCase")));
            setFirstLetterUppercaseText(await toFirstLetterUppercase(chrome.i18n.getMessage("FirstLetterUppercase")));
        })();
    }, []);

    return (
        <>
            {/* Title Reformatting Option */}
            <SelectOptionComponent
                id="titleFormatting"
                style={{
                    paddingTop: "15px"
                }}
                onChange={(value) => {
                    setTitleFormatting!(parseInt(value, 10));
                    Config.config!.titleFormatting = parseInt(value, 10);
                }}
                value={String(titleFormatting!)}
                label={chrome.i18n.getMessage("titleFormatting")}
                options={[
                    { value: "-1", label: chrome.i18n.getMessage("Disabled") },
                    { value: "1", label: chrome.i18n.getMessage("TitleCase") },
                    { value: "2", label: sentenceCaseText },
                    { value: "3", label: lowerCaseText },
                    { value: "4", label: firstLetterUppercaseText },
                    { value: "0", label: chrome.i18n.getMessage("CapitalizeWords") },
                ]}
                titleFormatting={titleFormatting!}
            />

            {/* Should Clean Emojis */}
            <ToggleOptionComponent
                id="shouldCleanEmojis"
                style={{
                    paddingTop: "15px"
                }}
                onChange={(value) => {
                    setShouldCleanEmojis(value);
                    Config.config!.shouldCleanEmojis = value;
                }}
                value={shouldCleanEmojis}
                label={chrome.i18n.getMessage("shouldCleanEmojis")}
                titleFormatting={titleFormatting!}
            />
            {
                titleFormatting === TitleFormatting.TitleCase &&
                <>
                    <ToggleOptionComponent
                        id="onlyTitleCaseInEnglish"
                        style={{
                            paddingTop: "15px"
                        }}
                        onChange={(value) => {
                            setOnlyTitleCaseInEnglish(value);
                            Config.config!.onlyTitleCaseInEnglish = value;
                        }}
                        value={onlyTitleCaseInEnglish}
                        label={chrome.i18n.getMessage("onlyTitleCaseInEnglish")}
                        titleFormatting={titleFormatting!}
                    />
                </>
            }

            {/* Thumbnail Fallback Option */}
            <SelectOptionComponent
                id="thumbnailFallback"
                style={{
                    paddingTop: "15px"
                }}
                onChange={(value) => {
                    setThumbnailFallback(value);
                    Config.config!.thumbnailFallback = parseInt(value, 10);
                }}
                value={thumbnailFallback}
                label={chrome.i18n.getMessage("thumbnailFallbackOption")}
                options={[
                    { value: "0", label: chrome.i18n.getMessage("RandomTime") },
                    { value: "2", label: chrome.i18n.getMessage("TheOriginalThumbnail") },
                    { value: "1", label: chrome.i18n.getMessage("showABlankBox") },
                    { value: "3", label: chrome.i18n.getMessage("AutoGenerated") },
                ]}
                titleFormatting={titleFormatting!}
                applyFormattingToOptions={true}
            />

            {
                thumbnailFallback === String(ThumbnailFallbackOption.AutoGenerated) &&
                <SelectOptionComponent
                    id="thumbnailFallbackAutogenerated"
                    style={{
                        paddingTop: "15px"
                    }}
                    onChange={(value) => {
                        setThumbnailFallbackAutogenerated(value);
                        Config.config!.thumbnailFallbackAutogenerated = parseInt(value, 10);
                    }}
                    value={thumbnailFallbackAutogenerated}
                    options={[
                        { value: "0", label: chrome.i18n.getMessage("Start") },
                        { value: "1", label: chrome.i18n.getMessage("Middle") },
                        { value: "2", label: chrome.i18n.getMessage("End") },
                    ]}
                    titleFormatting={titleFormatting!}
                    applyFormattingToOptions={true}
                />
            }

            {
                [String(ThumbnailFallbackOption.RandomTime), String(ThumbnailFallbackOption.AutoGenerated)].includes(thumbnailFallback) &&
                <ToggleOptionComponent
                    id="showLiveCover"
                    style={{
                        paddingTop: "15px"
                    }}
                    onChange={(value) => {
                        setShowLiveCover(value);
                        Config.config!.showLiveCover = value;
                    }}
                    value={showLiveCover}
                    label={chrome.i18n.getMessage("showLiveCover")}
                    titleFormatting={titleFormatting!}
                />
            }
        </>
    );
};
