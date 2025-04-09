import articles from '../data/articles.json';
import articleSchema from '../schemas/articles';
import comments from '../data/comments.json';
import commentSchema from '../schemas/comments';
import locations from '../data/locations.json';
import locationSchema from '../schemas/locations';
import posts from '../data/posts.json';
import postSchema from '../schemas/posts';
import practitioners from '../data/practitioners.json';
import practitionerSchema from '../schemas/practitioners';
import reviews from '../data/reviews.json';
import reviewSchema from '../schemas/reviews';
import users from '../data/users.json';
import userSchema from '../schemas/users';

export const collections = [
	{
		name: 'articles',
		schema: articleSchema,
		data: articles,
	},
	{
		name: 'comments',
		schema: commentSchema,
		data: comments,
	},
	{
		name: 'locations',
		schema: locationSchema,
		data: locations,
	},
	{
		name: 'posts',
		schema: postSchema,
		data: posts,
	},
	{
		name: 'practitioners',
		schema: practitionerSchema,
		data: practitioners,
	},
	{
		name: 'reviews',
		schema: reviewSchema,
		data: reviews,
	},
	{
		name: 'users',
		schema: userSchema,
		data: users,
	},
];
