import mongoose from 'mongoose';

const entrepriseSchema = new mongoose.Schema({
  entrepriseType: String,
  profession: String,
  startDate: String,
  domiciliation: String,
  workingAlone: String,
  entrepriseName: String,
  secteurActivite: String,
  autoEntrepreneur: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
});

const entrepriseModel = mongoose.models.entreprise || mongoose.model('entreprise', entrepriseSchema);

export default entrepriseModel;
