#!/bin/bash
# This is a wrapper script allowing to use GCP's IAP SSH option to connect
# to our servers.

destination="${@: -1: 1}"  # Grabs the last argument sent, the destination server + path.
source="${@: -2: 1}" # Grabs the second to last argument, the source path.

# Remove [] around our source, as gcloud scp doesn't understand this syntax
destination=$(echo "${destination}" | tr -d '[]')

# Only takes arguments with --, starts at the last argument.
# Finds which user is used to connect to the remote machine.
# Stops after gathering all -- arguments and user.
declare -a opts
user=""
for (( i=$# - 3; i>=1; i-- )); do
    ssh_arg="${!i}"
    if [[ "${ssh_arg}" == --* ]]; then
        opts+=("${ssh_arg}")
    elif [[ "${ssh_arg}" == *User* ]]; then
        user=$(echo "${ssh_arg}" | cut -d'=' -f2 | tr -d '"')
    elif [[ ${#opts[@]} -gt 0 && -n "$user" ]]; then
        break
    fi
done

# Execute the command
exec gcloud compute scp "${opts[@]}" "${source}" "${user}"@"${destination}"