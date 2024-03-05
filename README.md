# Setup

1. create `config.env` file in the root directory
2. Add following environment variables
	```env
		NODE_ENV = development
		PORT=5000
		CLIENT_URL=http://localhost:3000

		# mongodb
		DATABASE={{Database URL}}
		DATABASE_LOCAL=mongodb://localhost:27017/blogs
		DATABASE_PASSWORD={{Database Password}}

		# jwt
		JWT_SECRET= {{JWT Secret}}
		JWT_EXPIRES_IN = 90d
		JWT_COOKIE_EXPIRES_IN=90

		# dev email service
		EMAIL_USERNAME={{Email Username}}
		EMAIL_PASSWORD={{Email Password}}
		EMAIL_HOST={{Email Host}}
		EMAIL_PORT=25

		# prod email service
		# must match the sendgrid sender email
		EMAIL_FROM={{Email From}}
		SENDGRID_USERNAME=apikey
		SENDGRID_PASSWORD={{Sendgrid Password}}


		COOKIE_KEY=randomcookiekey420
		# google
		GOOGLE_CLIENT_ID={{Google Client ID}}
		GOOGLE_CLIENT_SECRET={{	Google Client Secret}}

		# cloudinary
		CLOUDINARY_CLOUDNAME={{Cloudinary Cloud Name}}
		CLOUDINARY_API_KEY={{Cloudinary API Key}}
		CLOUDINARY_API_SECRET={{Cloudinary API Secret}}
	```

3. npm install && cd client && npm install