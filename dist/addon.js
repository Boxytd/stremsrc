"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const stremio_addon_sdk_1 = require("stremio-addon-sdk");
const extractor_1 = require("./extractor");

const SCRIPT_MAP = {
    'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗', 'I': '𝓘', 'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟', 'Q': '𝓠', 'R': '𝓡', 'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩',
    'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱', 'i': '𝓲', 'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹', 'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃',
    '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿',
};

function toScript(text) {
    let result = '';
    for (const char of text) {
        if (SCRIPT_MAP[char]) {
            result += SCRIPT_MAP[char];
        } else {
            const lowerChar = char.toLowerCase();
            if (SCRIPT_MAP[lowerChar]) {
                result += SCRIPT_MAP[lowerChar];
            } else {
                result += char;
            }
        }
    }
    return result;
}

function createAIOStyledTitle(quality) {
    const START_EMOJI = '🐢';
    const END_EMOJI = '🤗';
    const cleanTitle = `stremsrc (${quality})`;
    return `${START_EMOJI}${toScript(cleanTitle)}${END_EMOJI}`;
}

const manifest = {
    id: "xyz.theditor.stremsrc",
    version: "0.1.0",
    catalogs: [],
    resources: [{ name: "stream", types: ["movie", "series"], idPrefixes: ["tt"] }],
    types: ["movie", "series"],
    name: "🅂🅃🅁🄴🄼🅂🅁🄲",
    description: "A VidSRC extractor for stremio",
};

const builder = new stremio_addon_sdk_1.addonBuilder(manifest);
builder.defineStreamHandler((_a) => __awaiter(void 0, [_a], void 0, function* ({ id, type }) {
    try {
        const res = yield (0, extractor_1.getStreamContent)(id, type);
        if (!res) return { streams: [] };
        let streams = [];
        for (const st of res) {
            if (!st.stream) continue;
            const REFERER_HEADER = `|Referer=${st.referer}`;
            if (st.hlsData && st.hlsData.qualities.length > 0) {
                streams.push({ title: createAIOStyledTitle('Auto Quality'), url: `${st.stream}${REFERER_HEADER}` });
                for (const quality of st.hlsData.qualities) {
                    streams.push({ title: createAIOStyledTitle(quality.title), url: `${quality.url}${REFERER_HEADER}` });
                }
            } else {
                streams.push({ title: createAIOStyledTitle('Unknown Quality'), url: `${st.stream}${REFERER_HEADER}` });
            }
        }
        return { streams };
    } catch (error) {
        console.error('Stream extraction failed:', error);
        return { streams: [] };
    }
}));
exports.default = builder.getInterface();
