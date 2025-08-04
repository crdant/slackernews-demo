# Embedded Cluster Post-Installation

Great! Your SlackerNews embedded cluster installation is complete.

## Next Steps

### 1. Access the Admin Console

The Replicated admin console is available at:
```
https://your-domain:8800
```

Or access it via port-forward:
```bash
kubectl port-forward -n default svc/kotsadm 8800:3000
```

### 2. Complete Application Setup

1. Upload your SlackerNews license
2. Configure your application settings
3. Deploy the application

### 3. Configure Slack Integration

1. Navigate to your SlackerNews instance at your configured domain
2. Follow the Slack integration setup wizard
3. Test the integration

### 4. SSL Certificate

If you haven't already configured SSL certificates, you can:
- Use Let's Encrypt (automatic)
- Upload your own certificates via the admin console

### 5. Monitor Your Installation

Access logs and monitoring through:
- The Replicated admin console
- Kubernetes dashboard
- Direct kubectl commands

## Troubleshooting

If you encounter issues:
1. Check the admin console for application logs
2. Verify your domain DNS settings
3. Ensure SSL certificates are properly configured
4. Consult our [documentation](https://docs.slackernews.io/vm/) for detailed troubleshooting

## Support

Need assistance? Contact us at [support@slackernews.io](mailto:support@slackernews.io) or visit our [GitHub issues](https://github.com/slackernews/slackernews/issues).