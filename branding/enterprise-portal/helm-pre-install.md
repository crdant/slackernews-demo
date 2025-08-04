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

In addition to DNS, SlackerNews requires that trusted TLS connections are used to connect from Slack. When deploying via Helm, you'll need to configure TLS certificates for secure communication.