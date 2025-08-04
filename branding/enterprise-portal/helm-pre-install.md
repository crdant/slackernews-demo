# Prereqs
SlackerNews is fully self-hosted and it integrates with a few different systems. Therefore the requirements are a bit technical.

1. A community license (registry username & password) to SlackerNews. Visit [SlackerNews.io](https://slackernews.io) to get a free license.
2. A domain or subdomain & the ability to control DNS for it.
3. Admin rights on your Slack Workspace (or approval from an admin).
4. Access to a Kubernetes cluster (1.23 or later)
5. Read level access to most of your companies primary tools (GitHub, Google Docs, Jira etc).

# Custom Domain Name

SlackerNews must be configured with a fully qualified domain name. The application uses [Slack events](https://api.slack.com/apis/connections/events-api) and Slack requires that connections are made over trusted TLS (https) connections. In order to meet this requirement, you'll need to provide a domain name and TLS keypair that is commonly trusted.  

You'll need to determine this domain before you get started in order to set up the [Slack app](/slack) and properly configure the [Helm chart](/helm) or [virtual machine](/vm) configuration. Generally, it's advised to configure SlackerNews with the DNS record, then determine the IP address that is being used, and add the DNS record last.

## Bring Your Own domain

The easiest solution to deploy the Helm chart to an existing Kubernetes cluster that supports [Load Balancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer) service types. This will provision an IP address at installation time, and you can then create a CNAME record pointing to the LoadBalancer address of the `slackernews-nginx` service. 

If you use a different service type, you will be responsible for routing traffic into the `slackernews-nginx` service. Common solutions here include using a NodePort or ClusterIP service, and setting up your own load balancer or gateway to allow traffic to route into the application.

For example, in this example, SlackerNews was deployed using Helm and the option: `--set slackernews.domain=news.somebigbank.com`.
After installation, the LoadBalancer is created:

```
kubectl get svc -n slackernews slackernews-nginx
NAME                TYPE           CLUSTER-IP      EXTERNAL-IP                                                              PORT(S)        AGE
slackernews-nginx   LoadBalancer   10.100.198.89   a6fa4c573a4dc490dbd3415319275340-126097229.us-east-1.elb.amazonaws.com   80:31698/TCP   14m
```

In this example the DNS administrator must create a CNAME from `news.somebigbank.com` => `a6fa4c573a4dc490dbd3415319275340-126097229.us-east-1.elb.amazonaws.com`.

## TLS

In addition to DNS, SlackerNews requires that trusted TLS connections are used to connect from Slack. When deploying via Helm, the four parameters `service.tls.cert`, `service.tls.key`, `service.tls.enabled` are required. These should be set to the contents of the cert, key, true, true respectively.

For example:

```
export SLACKERNEWS_CERT=`cat ./certificate.pem`
export SLACKERNEWS_KEY=`cat ./key.pem`

helm install \
    ... <other params removed> \
    --set service.tls.cert="$SLACKERNEWS_CERT" \
    --set service.tls.key="$SLACKERNEWS_KEY" \
    --set service.tls.enabled=true 

# Slack App
You'll need to create a Slack App to integrate with your SlackNews instance. This Slack app will provide user creation, authentication, as well as access the Slack messages for analysis. Luckily, this is as easy as copy/paste of a YAML manifest.

1. Visit your Slack Apps
2. [create a new app](https://api.slack.com/apps?new_app=1)
3. select "from an app manifest"
4. select your workspace
5. Paste the following manifest in (be sure to change the `redirect_url` and the `request_url` to use the domain at which you'll host SlackerNews).

```yaml
display_information:
  name: SlackerNews
  description: SlackerNews
  background_color: "#333333"
features:
  bot_user:
    display_name: SlackerNews
    always_online: false
oauth_config:
  redirect_urls:
    - https://<sub.yourdomain.com>/login/callback
  scopes:
    user:
      - links:read
      - channels:history
      - reactions:read
      - channels:write
    bot:
      - channels:read
      - links:read
      - team:read
      - users:read
      - users:read.email
      - reactions:read
      - usergroups:read
      - channels:join
      - channels:history
settings:
  event_subscriptions:
    request_url: https://<sub.yourdomain.com>/api/webhooks/slack
    user_events:
      - message.channels
      - reaction_added
    bot_events:
      - link_shared
      - message.channels
      - reaction_added
      - reaction_removed
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false
```
6. Click "Create".

7. Install into your workspace.

!!! Note
    
    Login will be automatically restricted to users who are logging into the Slack app that the bot token is installed on.

Once the app is installed, head to `YOUR_INSTANCE_URL`/admin/slack to configure the relevant fields

# Advanced Deployment Options

## Postgres 

SlackerNews can use a Postgresql database to store and track activity on shared links. The standard Helm chart includes a containerized version of Postgres to run, and defaults to enabling this.

It may be preferrable to run your own Postgres database, if you'd prefer to manage the stateful components of SlackerNews separately.

If you want to run Postgres outside of the cluster, use the following parameters to `helm install` or `helm upgrade`:

```
--set postgres.deploy_postgres=false \
--set postgres.uri=postgres://...

```

## Slack

Once you've created a [Slack app](/slack), you'll need the ClientID, ClientSecret, and Bot Token to use as parameters:

```
--set slack.clientId=3688491666547.38597... \
--set slack.clientSecret=96761d... \
--set slack.token=xoxb-3688491666... 
```
