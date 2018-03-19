import xml.etree.ElementTree as ET
import os
import operator

build_num_dirs = os.popen("ls -rt -d -1 /var/lib/jenkins/project_repo/reports/*").read()

build_num_dirs = build_num_dirs.split()

tests = {}

for build in build_num_dirs:
    test_files = mp = os.popen("find " + build + " -name '*.xml'").read()
    test_files = test_files.split()

    for test in test_files:
        tree = ET.parse(test)
        root = tree.getroot()
        for tc in root.findall('testcase'):
            name = tc.get('name')
            time = tc.get('time')
            fail = tc.findall('failure')
            error = tc.findall('error')

            if not name in tests:
                tests[name] = {'runtimes': [], 'num_passes': []}

            passed = (not fail) and (not error)
 
            if passed:
                tests[name]['runtimes'].append(float(time))
                tests[name]['num_passes'].append(1)
            else:
                tests[name]['num_passes'].append(0)

for key, value in tests.iteritems():
    sum = 0
    runtimes = tests[key]['runtimes']
    for val in runtimes:
        sum += val
    avg = sum / len(runtimes)
    tests[key]['avg_runtime'] = avg

for key, value in tests.iteritems():
    sum = 0
    passes = tests[key]['num_passes']
    for val in passes:
        sum += val
    avg = float(sum) / len(passes)
    tests[key]['avg_pass_rate'] = avg

test_list = [[key, tests[key]['avg_runtime'], tests[key]['avg_pass_rate']] for key in tests]
sorted_test_list = sorted(test_list, key = operator.itemgetter(1), reverse=True)
sorted_test_list = sorted(sorted_test_list, key = operator.itemgetter(2), reverse=True)

for test in sorted_test_list:
    spaces = ''
    for x in range(40 - len(test[0])):
        spaces += ' '
    print "Test: %s %s Avg_Time: %.2f \t Pass_Rate: %.2f" % (test[0], spaces, test[1], test[2] * 100.0,)
