FROM pyratin/base
MAINTAINER "pyratin <pyratin@hotmail.com>"
WORKDIR /app
COPY ./.entrypoint.*.sh /app/
COPY ./package.json /app/package.json
COPY ./index.html /app/index.html
COPY ./views /app/views
COPY ./dist /app/dist
COPY ./data/db /data/db/
COPY ./media /app/media
COPY ./babelRelayPlugin.js /app/babelRelayPlugin.js
COPY ./schema.json /app/schema.json
RUN npm install --production
EXPOSE 2000
EXPOSE 3000
EXPOSE 3128
ENV MONGODB_URL mongodb://localhost:27017/
CMD ["npm", "start"]
