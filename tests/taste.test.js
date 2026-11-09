import {test} from 'node:test';
import assert from 'node:assert/strict';
import {tasteProfile,tasteProfiles} from '../lib/taste.js';
test('every food persona can be selected from its menus',()=>{const cases=[['제육볶음','meat'],['돈까스','crispy'],['우동','noodle'],['순두부찌개','soup'],['볶음밥','rice'],['샐러드','veggie'],['고등어구이','sea'],['계란말이','protein']];for(const [food,id]of cases)assert.equal(tasteProfile([food]).id,id);assert.equal(tasteProfiles.length,10);});
test('empty or unknown preferences explore, ties mix, and removal changes persona',()=>{assert.equal(tasteProfile().id,'explorer');assert.equal(tasteProfile(['내가좋아하는것']).id,'explorer');assert.equal(tasteProfile(['제육','우동']).id,'mixed');assert.equal(tasteProfile(['우동']).id,'noodle');assert.equal(tasteProfile([],['육류']).id,'meat');});
test('duplicate preferences do not skew votes; the strongest preference wins',()=>{assert.equal(tasteProfile(['제육','제육','우동']).id,'mixed');assert.equal(tasteProfile(['제육','불고기','우동']).id,'meat');});
