#!/bin/bash
# This is a wrapper script allowing to use GCP's IAP SSH option to connect
# to our servers.

# Ansible passes a large number of SSH parameters along with the hostname as the
# second to last argument and the command as the last. We will pop the last two
# arguments off of the list and then pass all of the other SSH flags through
# without modification:
cmd="${@: -1: 1}"  # Grabs the last argument sent
host="${@: -2: 1}" # Grabs the second to last argument

# Unfortunately ansible has hardcoded ssh options, so we need to filter these out.
# It's an ugly hack, but for now we'll only accept the options starting with '--'.
declare -a opts 
for ssh_arg in "${@: 1: $# -3}" ; do 
    if [[ "${ssh_arg}" == --* ]] ; then
        opts+=("${ssh_arg}")
    fi
done

# Execute the gcloud compute ssh command with filtered options
exec gcloud compute ssh "${opts[@]}" "${host}" -- -C "${cmd}"
