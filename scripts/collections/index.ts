import articles from "../data/articles.json";
import articleSchema from "../schemas/articles";
import comments from "../data/comments.json";
import commentSchema from "../schemas/comments";
import locations from "../data/locations.json";
import locationSchema from "../schemas/locations";
import forumPosts from "../data/forum_posts.json";
import postSchema from "../schemas/forum_posts";
import practitioners from "../data/practitioners.json";
import practitionerSchema from "../schemas/practitioners";
import reviews from "../data/reviews.json";
import reviewSchema from "../schemas/reviews";
import users from "../data/users.json";
import userSchema from "../schemas/users";
import socialPosts from "../data/social_posts.json";
import socialPostSchema from "../schemas/social_posts";
import videos from "../data/videos.json";
import videoSchema from "../schemas/videos";

export const collections = [
	{
		name: "articles",
		schema: articleSchema,
		data: articles,
	},
	{
		name: "comments",
		schema: commentSchema,
		data: comments,
	},
	{
		name: "locations",
		schema: locationSchema,
		data: locations,
	},
	{
		name: "forum_posts",
		schema: postSchema,
		data: forumPosts,
	},
	{
		name: "practitioners",
		schema: practitionerSchema,
		data: practitioners,
	},
	{
		name: "reviews",
		schema: reviewSchema,
		data: reviews,
	},
	{
		name: "users",
		schema: userSchema,
		data: users,
	},
	{
		name: "social_posts",
		schema: socialPostSchema,
		data: socialPosts,
	},
	{
		name: "videos",
		schema: videoSchema,
		data: videos,
	},
];
