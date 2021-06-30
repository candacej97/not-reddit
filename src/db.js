const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

// add your schemas
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    articles: [{ ref: 'Article', type: mongoose.Schema.Types.String }]
});

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true, match: /^http/ },
    description: String,
    postedBy: String
});

// use plugins (for slug)
ArticleSchema.plugin(URLSlugs('title', {field: 'slug', separator: '-', update: true }));

// register your model
mongoose.model('Article', ArticleSchema);
mongoose.model('User', UserSchema);

mongoose.connect('mongodb://localhost/hw06', { useNewUrlParser: true, useCreateIndex: true });
