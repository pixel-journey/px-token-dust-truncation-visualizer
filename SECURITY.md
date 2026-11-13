# Security notes — dust math

| Mitigated | Behavior |
| --- | --- |
| Bad bps / amount | refused |
| shares > totalShares | refused |
| totalShares 0 | refused |
| hops bounds | 1..32 |

Production: do not use floating point; define remainder ownership; watch multi-hop fee paths for economic grief.
