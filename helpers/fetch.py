import os

languages = ['hi','bn','mr','te','ta','ur','kn','gu','sd','bh','ml','or','pa','as','new','ks','ne','bp','sa','pi']
num_edits_url = 'http://gp-dev.wmflabs.org/data/datafiles/gp/%s_revs_monthly.csv'
edit_size_url = 'http://gp-dev.wmflabs.org/data/datafiles/gp/%s_bytes_monthly.csv'

for project in languages:
	os.popen("wget "+num_edits_url %(project))
	os.popen("wget "+edit_size_url %(project))

