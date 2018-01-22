const chai = require('chai');
const assert = chai.assert;
const UrlParser = require('../lib/url_parser.js');

describe('UrlParser',()=>{
    describe('#isValidUrl',()=>{
        it('should return true for valid url',()=>{
            let parser = new UrlParser('/john/123');
            assert.isOk(parser.isValidUrl());
        })
        it('should return false for invalid url',()=>{
            let parser = new UrlParser('/^');
            assert.isNotOk(parser.isValidUrl());
            parser = new UrlParser('/ravinder/abc');
            assert.isNotOk(parser.isValidUrl());        
        })
    })
    describe('#getUserName',()=>{
        it('should return username from the given url',()=>{
            let parser = new UrlParser('/john/123');
            assert.equal(parser.getUserName(),'john');
        })
    })
    describe('#getId',()=>{
        it('should return id from the given url',()=>{
            let parser = new UrlParser('/john/123');
            assert.equal(parser.getId(),123);
        })
    })
    describe('#parse',()=>{
        it('should parse and return object with id and username from the given url',()=>{
            let parser = new UrlParser('/john/123');
            assert.deepEqual(parser.parse(),{userName:'john',todoId:'123'});
        })
    })
})