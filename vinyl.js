/* eslint-disable indent, no-magic-numbers */

/*
 *
 * Service:Library
 * Vinyl - A record store
 *
 */

(() => {

  /*
  Dependencies
  */

  const _ = {
    toSingular: string => {
      let result = string;

      if (result.substr(-3) === 'ies') {
        result = `${result.slice(0, -3)}y`;
      }

      if (result.substr(-1) === 's') {
        result = result.slice(0, -1);
      }

      return result;
    }
  };

  /*
  Framework
  */

  const RecordType = {
    id: String,
    name: String,
    description: String,
    attributes: Object
  };

  class Record {
    static store = new Map();

    static create = Record.store.set.bind(Record.store);
    static read = Record.store.get.bind(Record.store);
    static update = Record.create.bind(Record.store);
    static delete = Record.store.delete.bind(Record.store);
    static list = Record.store.values.bind(Record.store);

    static search = ({ search, exclude }) => {
      const index = Array
        .from(Record.list())
        .map(({ id, name, description }) => ({
          id, name, description
        })) || [];

      let result = [];

      const alphabetical = index
        .filter(({ id = '', name = '', description = '' }) => (
          id.substring(0, exclude.length) !== exclude && (
            name.toLowerCase().trim().match(search.toLowerCase().trim()) ||
            description.toLowerCase().trim().match(search.toLowerCase().trim())
          )
        ))
        .sort((a, b) => (
          a.name.toLowerCase() < b.name.toLowerCase()
            ? -1
            : 1
        ));

      alphabetical.forEach((record, index) => {
        const criteria = (
          record?.name.toLowerCase().trim() === search.toLowerCase().trim()
        );

        if (criteria) {
          result.push(record);
          alphabetical.splice(index, 1);
        }
      });

      alphabetical.forEach((record, index) => {
        const criteria = (
          record?.name.toLowerCase().substring(0, 2) === search.toLowerCase().substring(0, 2)
        );

        if (criteria) {
          result.push(record);
          alphabetical.splice(index, 1);
        }
      });

      alphabetical.forEach((record, index) => {
        const criteria = (
          record?.name.toLowerCase().charAt(0) === search.toLowerCase().charAt(0)
        );

        if (criteria) {
          result.push(record);
          alphabetical.splice(index, 1);
        }
      });

      return [
        ...result,
        ...alphabetical
      ];
    };

    constructor ({
      id,
      name,
      description = 'No description.',
      attributes = {},

      ...references
    }) {
      return Record.create(id, {
        id: new RecordType.id(id),
        name: new RecordType.name(name),
        description: new RecordType.description(description),
        attributes: new RecordType.attributes(attributes),

        ...Object.assign(
          ...Object.keys(references || {})
            .map(referenceKey => {
              const reference = references[referenceKey];
              const isList = Array.isArray(reference);

              const recordResult = isList
                ? reference.map(ref => {
                    return Record.read(`${_.toSingular(referenceKey)}-${ref}`);
                  })
                : Record.read(`${_.toSingular(referenceKey)}-${reference}`);

              return {
                [referenceKey]: recordResult
              };
            }),
          {}
        )
      });
    }
  }

  class RecordCollection {
    constructor (data) {
      return Object
        .keys(data)
        .map(recordName => data[recordName]
          .map(record => new Record({
            ...record,

            id: `${_.toSingular(recordName)}-${record.id}`
          }))
        );
    }
  }

  /*
  Exports
  */

  module.exports = {
    RecordType,
    Record,
    RecordCollection
  };
})();
