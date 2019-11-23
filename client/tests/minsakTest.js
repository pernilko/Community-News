// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import {MineSaker} from '../src/Components/Views';
import { shallow, mount } from 'enzyme';
import { Nyhetssak, nyhetssakService } from '../src/services.js';

//jest.mock('../src/services.js');

describe('MineSaker tests', () => {
    const wrapper = shallow(<MineSaker match={{params: {id: 1}}}/>);

    it('initially', () => {
        let instance = MineSaker.instance();
        expect(typeof instance).toEqual('object');
        jest.spyOn(nyhetssakService, 'getSakBruker').mockResolvedValue([]);
        wrapper.update();
        if (instance) expect(wrapper.debug()).toMatchSnapshot();
    });

    it('after load', () => {
        let tab: Nyhetssak[] = [new Nyhetssak(1, 'Overskrift', 'Innhold', '2019-10-11 02-20', 'bilde.jpg', 'Sport', false, 10, 1)]
        jest.spyOn(nyhetssakService, 'getSakBruker').mockResolvedValue(tab);
        wrapper.update()
        let instance = MineSaker.instance();
        expect(typeof instance).toEqual('object');
        if (instance) {
            instance.forceUpdate();
            instance.saker = tab;
            expect(wrapper.debug()).toMatchSnapshot();
        };
    });
});