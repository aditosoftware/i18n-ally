type ParamMeta = {
  id: number;
  original: string; // full original match
  name: string;     // extracted param name
};

/**
 * Encodes the parameters of the input string and replaces them with xml marker tags
 * @param input the text to encode
 * @returns an object with the encoded text and the original params
 */
export function encodeParams(input: string): {
  text: string;
  params: ParamMeta[];
} {
  const params: ParamMeta[] = [];
  let index = 0;

  // Matches:
  // [[param]]
  // {{param}}
  // {{-param, something, data}}
  const regex = /\[\[\s*([^\]]+?)\s*\]\]|\{\{\s*-?\s*([^,}\s]+)[^}]*\}\}/g;

  const text = input.replace(regex, (match, ...pMatch) => {
    const name = pMatch.find(e => e).trim();

    const meta: ParamMeta = {
      id: index,
      original: match,
      name,
    };

    params.push(meta);

    const replacement = `<m id="${index}">${name}</m>`;
    index++;

    return replacement;
  });

  return { text, params };
}

/**
 * Takes an encoded translation string and replaces the xml marker tags with the strings from the params
 * @param translated the translated string to decode
 * @param params the params to insert into the placeholder tags
 * @returns the decoded string with the correct params
 */
export function decodeParams(
  translated: string,
  params: ParamMeta[]
): string {
  return translated.replace(
    /<m\s+id="(\d+)">.*?<\/m>/g,
    (_, idStr) => {
      const id = Number(idStr);
      const meta = params[id];

      if (!meta) return _;
      return meta.original;
    }
  );
}