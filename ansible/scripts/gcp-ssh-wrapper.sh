#!/bin/bash
# This is a wrapper script allowing to use GCP's IAP SSH option to connect
# to our servers.

cmd="${@: -1: 1}"  # Grabs the last argument sent, the command to execute.
host="${@: -2: 1}" # Grabs the second to last argument, the host itself.

# Only takes arguments with --, starts at the last argument and stops after gathering all -- arguments.
declare -a opts
for (( i=$# - 3; i>=1; i-- )); do
    ssh_arg="${!i}"
    if [[ "${ssh_arg}" == --* ]]; then
        opts+=("${ssh_arg}")
    elif [ ${#opts[@]} -gt 0 ]; then
        break
    fi
done


# Execute the gcloud compute ssh command with filtered options
exec gcloud compute ssh "${opts[@]}" "${host}" -- -C "${cmd}"
