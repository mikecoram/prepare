const { SectionTemplate, ExampleTemplate, QuestionTemplate, ValueGenerator } = require('../models');

exports.seed = seed;
exports.createRecord = createRecord;
exports.createManyRecords = createManyRecords;

// Seed all the templates for a section
function seed(sectionTemplate, exampleTemplates, questionTemplates, valueGenerators) {
  return new Promise((resolve, reject) => {
    createRecord(SectionTemplate, sectionTemplate).then((st) => {
      createManyRecords(ExampleTemplate, exampleTemplates, [{
        key: 'sectionTemplateId', 
        val: st.id
      }]).then((ets) => {
        createManyRecords(QuestionTemplate, questionTemplates, [{
          key: 'sectionTemplateId',
          val: st.id
        }]).then((qts) => {
          let seq = [];

          qts.forEach((qt) => {
            let vgsAtPosition = valueGenerators.filter((vg) => { 
              return vg.questionPosition == qt.position;
            });
            seq.push(createManyRecords(ValueGenerator, vgsAtPosition, [{
              key: 'questionTemplateId',
              val: qt.id
            }]));
          });

          Promise.all(seq).then((results) => {
            resolve(results);
          }, (err) => {
            reject(err);
          });
        });
      });
    });
  });
}

function createManyRecords(model, dataList, foreignKeys) {
  return new Promise((resolve, reject) => {
    let seq = [];

    dataList.forEach((data) => {
      // Inject foreign keys
      foreignKeys.forEach((fk) => {
        data[fk.key] = fk.val;
      });
      // Push createRecord promise
      seq.push(createRecord(model, data));
    });

    Promise.all(seq).then((recordList) => {
      resolve(recordList);
    }, (err) => {
      reject(err);
    });
  });
}

function createRecord(model, data) {
  return new Promise((resolve, reject) => {
    model.create(data).then((record) => {
      resolve(record);
    }, (err) => {
      reject(err);
    });
  });
}
