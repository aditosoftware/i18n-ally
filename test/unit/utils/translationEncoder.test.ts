import { expect } from 'chai'
import { decodeParams, encodeParams } from '../../../src/utils/translationEncoder'

describe('TranslationEncoding', () => {
  const cases = [
    ['Hello {{World}}', 'Hello <m id="0">World</m>'],
    ['Hello {{World}} {{Foo}}', 'Hello <m id="0">World</m> <m id="1">Foo</m>'],
    ['Hello [[World]]', 'Hello <m id="0">World</m>'],
    ['Hello {{-Person}}', 'Hello <m id="0">Person</m>'],
    ['Hello {{Person, uppercase, bold}}!', 'Hello <m id="0">Person</m>!'],
    ['Hello Person!', 'Hello Person!'],
    ['Hello {Person}', 'Hello {Person}'],
  ]

  for (const [input, output] of cases) {
    it(input, () => {
      const actualOutput = encodeParams(input)
      const actualParse = decodeParams(actualOutput.text, actualOutput.params)
      expect(actualOutput.text).to.equal(output)
      expect(actualParse).to.equal(input)
    })
  }
})

describe('TranslationEncoding - complex', () => {
  const cases = [
    [
      'Hello {{World}} how are you? This is {{ISS}}',
      'Hello <m id="0">World</m> how are you? This is <m id="1">ISS</m>',
      'Hello <m id="1">ISS</m> how are you? This is <m id="0">World</m>',
      'Hello {{ISS}} how are you? This is {{World}}',
    ],
    [
      'Hello [[Dropdown]], you have {{-count, float}} new Messages!',
      'Hello <m id="0">Dropdown</m>, you have <m id="1">count</m> new Messages!',
      'You have <m id="1">count</m> new Messages! Hello <m id="0">Dropdown</m>',
      'You have {{-count, float}} new Messages! Hello [[Dropdown]]',
    ],
    [
      'Are you sure you want to delete {{item, uppercase}}?',
      'Are you sure you want to delete <m id="0">item</m>?',
      'Are you sure you want to delete <m id="0">item</m>? <m id="0">item</m> will be lost forever!',
      'Are you sure you want to delete {{item, uppercase}}? {{item, uppercase}} will be lost forever!',
    ],
  ]

  for (const [input, output, translated, parsed] of cases) {
    it(input, () => {
      const actualOutput = encodeParams(input)
      const actualParse = decodeParams(translated, actualOutput.params)
      expect(actualOutput.text).to.equal(output)
      expect(actualParse).to.equal(parsed)
    })
  }
})
