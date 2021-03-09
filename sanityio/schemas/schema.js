// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'
import captionImage from './objects/captionImage'
import richText from './objects/richText'

import biketagWebsite from './documents/biketag-website.js'

import { translateFields } from './fieldTranslation'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes
  .concat([
    // Any base object you've defined,
    // or document type that should not have
    // field-level validations
    richText,
    captionImage,
  ])
  // Include documents with field translation support.
  // This changes their structure, transforming
  // simple fields like 'string' into 'object'
  // with multiple string properties, one per
  // language.
  //
  // Any document definition that does
  // not set localize: true on root level, or
  // set localize: true on any field level will
  // not be changed.
  .concat(translateFields([
    biketagWebsite,
  ]))
})
