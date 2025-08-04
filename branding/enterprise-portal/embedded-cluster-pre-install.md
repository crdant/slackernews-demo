# Embedded Cluster Prerequisites

SlackerNews can be deployed using an embedded Kubernetes cluster for simplified installation.

## System Requirements

- **Operating System**: Ubuntu 20.04+ or RHEL 8+
- **CPU**: 4 cores minimum (8 cores recommended)
- **Memory**: 8GB RAM minimum (16GB recommended)
- **Disk**: 100GB available space
- **Network**: Outbound internet access required

## Prerequisites

1. A community license to SlackerNews. Visit [SlackerNews.io](https://slackernews.io) to get a free license.
2. A domain or subdomain & the ability to control DNS for it.
3. Admin rights on your Slack Workspace (or approval from an admin).
4. Root or sudo access on the target server.

## Domain Configuration

Configure your domain to point to the server where you'll install SlackerNews. The application requires HTTPS for Slack integration.

## Firewall Requirements

Ensure the following ports are accessible:
- **80**: HTTP (redirects to HTTPS)
- **443**: HTTPS
- **8800**: Admin console (optional, can be accessed via kubectl port-forward)

You're now ready to proceed with the embedded cluster installation!