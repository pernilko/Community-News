// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import {LiveFeed, LiveFeedElement} from '../src/Components/staticComponents';
import { shallow, mount } from 'enzyme';

describe('Livefeed tests', () => {
    const wrapper = shallow(<LiveFeed />);

    it('initially', () => {
        let instance = LiveFeed.instance();
        expect(typeof instance).toEqual('object');
        if (instance) expect(instance.saker).toEqual([]);
    });

    it('after load', () => {
        
        setTimeout(() => {
            let instance = LiveFeed.instance();
            expect(typeof instance).toEqual('object');

            if (instance) expect(instance.saker).toEqual([]);
        });
    });
});