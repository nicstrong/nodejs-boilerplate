import { who } from "../src/main"

describe('entry point', () => {


  it('exports who function', () => {

    expect(who()).toBe('world!!!')
  })

})
