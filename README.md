# Example Node.js Project Nix Flake

Flake is set up as a fixed output derivation. This means we can do impure things like access the internet (for NPM to work) as long as we lock down the output hash. Because NPM has a lock file it **should** be determistic.

This is mostly a learning exercise to help me master the Nix programming language.

## Building

    nix build

## Developing

    nix develop

## Add as systemd service

Add the following to `configuration.nix` to always run in the background:

```nix
  # Add the flake as an input
  nixpkgs.overlays = [
    (final: prev: {
      nodeNix = (builtins.getFlake (toString /home/cjdell/Projects/node-nix)).packages.${pkgs.system}.default;
    })
  ];

  # Define the systemd service
  systemd.services.node-nix = {
    description = "Node Nix Service";
    after = [ "network.target" ];

    # Ensure the service is started at boot
    wantedBy = [ "multi-user.target" ];

    # Run the output of the flake with the Node.js binary
    serviceConfig = {
      ExecStart = "${pkgs.nodejs}/bin/node ${pkgs.nodeNix}/lib/out/main.mjs";
      Restart = "always";
      Environment = "NODE_ENV=production";
    };
  };

  # Enable the service
  systemd.services.node-nix-service.enable = true;
```

Verify it is running with:

    sudo journalctl -u node-nix -f
