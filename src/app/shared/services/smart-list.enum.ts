import { TransitiveCompileNgModuleMetadata } from '@angular/compiler';

export class SmartList {

    static smartListValues: Array<{ type: string; data: Array<{ id: number | string; name: string }> }> = [
        {
            type: 'training',
            data: [
                {
                    id: '1.0',
                    name: 'Yes'
                },
                {
                    id: '2.0',
                    name: 'No'
                }
            ]
        }, {
            type: 'commodityType',
            data: [
                {
                    id: '1.0',
                    name: 'Architect and Engineering'
                },
                {
                    id: '2.0',
                    name: 'Architect and Engineering NCTR only'
                },
                {
                    id: '3.0',
                    name: 'AV Equipment and Installation'
                },
                {
                    id: '4.0',
                    name: 'Building Security'
                },
                {
                    id: '5.0',
                    name: 'Chemicals'
                },
                {
                    id: '6.0',
                    name: 'Conference Event Planning'
                },
                {
                    id: '7.0',
                    name: 'Construction NCTR only'
                },
                {
                    id: '8.0',
                    name: 'Construction or Renovations'
                },
                {
                    id: '9.0',
                    name: 'Copier/Maintenance'
                },
                {
                    id: '10.0',
                    name: 'Document Management'
                },
                {
                    id: '11.0',
                    name: 'Drugs'
                },
                {
                    id: '12.0',
                    name: 'Furniture'
                },
                {
                    id: '13.0',
                    name: 'Guard Services'
                },
                {
                    id: '14.0',
                    name: 'Information Technology Acquisitions'
                },
                {
                    id: '15.0',
                    name: 'Janitorial'
                },
                {
                    id: '16.0',
                    name: 'Janitorial NCTR only'
                },
                {
                    id: '17.0',
                    name: 'Lab Equipment CBER'
                },
                {
                    id: '18.0',
                    name: 'Lab Equipment CDER'
                },
                {
                    id: '19.0',
                    name: 'Lab Equipment CDRH'
                },
                {
                    id: '20.0',
                    name: 'Lab Equipment CFSAN'
                },
                {
                    id: '21.0',
                    name: 'Lab Equipment CTP'
                },
                {
                    id: '22.0',
                    name: 'Operation and Maintenance'
                },
                {
                    id: '23.0',
                    name: 'Lab Equipment NCTR'
                },
                {
                    id: '24.0',
                    name: 'Lab Equipment OC'
                },
                {
                    id: '25.0',
                    name: 'Lab Equipment ORA Delivered To ARL Only'
                },
                {
                    id: '26.0',
                    name: 'Lab Equipment ORA Not NCTR'
                },
                {
                    id: '27.0',
                    name: 'Lab Equipment under $100K'
                },
                {
                    id: '28.0',
                    name: 'Lab Supplies'
                },
                {
                    id: '29.0',
                    name: 'Mail'
                },
                {
                    id: '30.0',
                    name: 'Maintenance Agreement'
                },
                {
                    id: '31.0',
                    name: 'Moving'
                },
                {
                    id: '32.0',
                    name: 'OCI All Other'
                },
                {
                    id: '33.0',
                    name: 'OCI IT'
                },
                {
                    id: '34.0',
                    name: 'OCI Services'
                },
                {
                    id: '35.0',
                    name: 'Office Supplies'
                },
                {
                    id: '36.0',
                    name: 'Operation and Maintenance NCTR only'
                },
                {
                    id: '37.0',
                    name: 'ORA DFSR State Contracts'
                },
                {
                    id: '38.0',
                    name: 'Parking'
                },
                {
                    id: '39.0',
                    name: 'Reagents'
                },
                {
                    id: '40.0',
                    name: 'Research and Development Services Studies'
                },
                {
                    id: '41.0',
                    name: 'Shredding'
                },
                {
                    id: '42.0',
                    name: 'Shuttle Services'
                },
                {
                    id: '43.0',
                    name: 'Subscriptions'
                },
                {
                    id: '44.0',
                    name: 'Systems Technology Acquisitions'
                },
                {
                    id: '45.0',
                    name: 'Temporary Professional Services'
                },
                {
                    id: '46.0',
                    name: 'Tobacco States Program'
                },
                {
                    id: '47.0',
                    name: 'Training'
                },
                {
                    id: '48.0',
                    name: 'Waste Management'
                },
                {
                    id: '49.0',
                    name: 'Animals'
                },
                {
                    id: '50.0',
                    name: 'Advertising'
                },
                {
                    id: '51.0',
                    name: 'Administrative Support'
                },
                {
                    id: '52.0',
                    name: 'Lab Equipment CVM'
                }
            ]
        }, {
            type: 'iaaStatus',
            data: [
                {
                    id: '1.0',
                    name: 'Active'
                },
                {
                    id: '2.0',
                    name: 'Cancelled'
                }
            ]
        }, {
            type: 'fbrNumber',
            data: [
                {
                    id: '1.0',
                    name: 'New FBR Line Item'
                },
                {
                    id: '2.0',
                    name: 'S&E Line Item'
                },
                {
                    id: '3.0',
                    name: 'FBR-NEITCT'
                },
                {
                    id: '4.0',
                    name: 'FBR-000002'
                },
                {
                    id: '5.0',
                    name: 'FBR-000003'
                },
                {
                    id: '6.0',
                    name: 'FBR-000004'
                },
                {
                    id: '7.0',
                    name: 'FBR-000005'
                },
                {
                    id: '8.0',
                    name: 'FBR-000006'
                },
                {
                    id: '9.0',
                    name: 'FBR-000007'
                },
                {
                    id: '10.0',
                    name: 'FBR-000008'
                },
                {
                    id: '11.0',
                    name: 'FBR-000011'
                },
                {
                    id: '12.0',
                    name: 'FBR-000013'
                },
                {
                    id: '13.0',
                    name: 'FBR-000332'
                },
                {
                    id: '14.0',
                    name: 'FBR-000917'
                },
                {
                    id: '15.0',
                    name: 'FBR-000961'
                },
                {
                    id: '16.0',
                    name: 'FBR-000981'
                },
                {
                    id: '17.0',
                    name: 'FBR-000984'
                },
                {
                    id: '18.0',
                    name: 'FBR-000999'
                },
                {
                    id: '19.0',
                    name: 'FBR-001006'
                },
                {
                    id: '20.0',
                    name: 'FBR-000015'
                },
                {
                    id: '21.0',
                    name: 'FBR-000016'
                },
                {
                    id: '22.0',
                    name: 'FBR-000017'
                },
                {
                    id: '23.0',
                    name: 'FBR-000020'
                },
                {
                    id: '24.0',
                    name: 'FBR-000021'
                },
                {
                    id: '25.0',
                    name: 'FBR-000026'
                },
                {
                    id: '26.0',
                    name: 'FBR-000027'
                },
                {
                    id: '27.0',
                    name: 'FBR-000028'
                },
                {
                    id: '28.0',
                    name: 'FBR-000029'
                },
                {
                    id: '29.0',
                    name: 'FBR-000030'
                },
                {
                    id: '30.0',
                    name: 'FBR-000031'
                },
                {
                    id: '31.0',
                    name: 'FBR-000032'
                },
                {
                    id: '32.0',
                    name: 'FBR-000035'
                },
                {
                    id: '33.0',
                    name: 'FBR-000036'
                },
                {
                    id: '34.0',
                    name: 'FBR-000040'
                },
                {
                    id: '35.0',
                    name: 'FBR-000043'
                },
                {
                    id: '36.0',
                    name: 'FBR-000047'
                },
                {
                    id: '37.0',
                    name: 'FBR-000048'
                },
                {
                    id: '38.0',
                    name: 'FBR-000049'
                },
                {
                    id: '39.0',
                    name: 'FBR-000050'
                },
                {
                    id: '40.0',
                    name: 'FBR-000051'
                },
                {
                    id: '41.0',
                    name: 'FBR-000052'
                },
                {
                    id: '42.0',
                    name: 'FBR-000053'
                },
                {
                    id: '43.0',
                    name: 'FBR-000054'
                },
                {
                    id: '44.0',
                    name: 'FBR-000056'
                },
                {
                    id: '45.0',
                    name: 'FBR-000057'
                },
                {
                    id: '46.0',
                    name: 'FBR-000058'
                },
                {
                    id: '47.0',
                    name: 'FBR-000059'
                },
                {
                    id: '48.0',
                    name: 'FBR-000060'
                },
                {
                    id: '49.0',
                    name: 'FBR-000061'
                },
                {
                    id: '50.0',
                    name: 'FBR-000062'
                },
                {
                    id: '51.0',
                    name: 'FBR-000063'
                },
                {
                    id: '52.0',
                    name: 'FBR-000064'
                },
                {
                    id: '53.0',
                    name: 'FBR-000065'
                },
                {
                    id: '54.0',
                    name: 'FBR-000066'
                },
                {
                    id: '55.0',
                    name: 'FBR-000072'
                },
                {
                    id: '56.0',
                    name: 'FBR-000076'
                },
                {
                    id: '57.0',
                    name: 'FBR-000078'
                },
                {
                    id: '58.0',
                    name: 'FBR-000079'
                },
                {
                    id: '59.0',
                    name: 'FBR-000080'
                },
                {
                    id: '60.0',
                    name: 'FBR-000081'
                },
                {
                    id: '61.0',
                    name: 'FBR-000082'
                },
                {
                    id: '62.0',
                    name: 'FBR-000084'
                },
                {
                    id: '63.0',
                    name: 'FBR-000085'
                },
                {
                    id: '64.0',
                    name: 'FBR-000086'
                },
                {
                    id: '65.0',
                    name: 'FBR-000087'
                },
                {
                    id: '66.0',
                    name: 'FBR-000088'
                },
                {
                    id: '67.0',
                    name: 'FBR-000089'
                },
                {
                    id: '68.0',
                    name: 'FBR-000090'
                },
                {
                    id: '69.0',
                    name: 'FBR-000092'
                },
                {
                    id: '70.0',
                    name: 'FBR-000093'
                },
                {
                    id: '71.0',
                    name: 'FBR-000094'
                },
                {
                    id: '72.0',
                    name: 'FBR-000144'
                },
                {
                    id: '74.0',
                    name: 'FBR-000604'
                },
                {
                    id: '75.0',
                    name: 'FBR-000605'
                },
                {
                    id: '76.0',
                    name: 'FBR-000620'
                },
                {
                    id: '77.0',
                    name: 'FBR-000621'
                },
                {
                    id: '78.0',
                    name: 'FBR-000622'
                },
                {
                    id: '79.0',
                    name: 'FBR-000623'
                },
                {
                    id: '80.0',
                    name: 'FBR-000624'
                },
                {
                    id: '81.0',
                    name: 'FBR-000625'
                },
                {
                    id: '82.0',
                    name: 'FBR-000626'
                },
                {
                    id: '83.0',
                    name: 'FBR-000627'
                },
                {
                    id: '84.0',
                    name: 'FBR-000628'
                },
                {
                    id: '85.0',
                    name: 'FBR-000630'
                },
                {
                    id: '86.0',
                    name: 'FBR-000631'
                },
                {
                    id: '87.0',
                    name: 'FBR-000632'
                },
                {
                    id: '88.0',
                    name: 'FBR-000633'
                },
                {
                    id: '89.0',
                    name: 'FBR-000634'
                },
                {
                    id: '90.0',
                    name: 'FBR-000635'
                },
                {
                    id: '91.0',
                    name: 'FBR-000636'
                },
                {
                    id: '92.0',
                    name: 'FBR-000637'
                },
                {
                    id: '93.0',
                    name: 'FBR-000638'
                },
                {
                    id: '94.0',
                    name: 'FBR-000639'
                },
                {
                    id: '95.0',
                    name: 'FBR-000640'
                },
                {
                    id: '96.0',
                    name: 'FBR-000641'
                },
                {
                    id: '97.0',
                    name: 'FBR-000642'
                },
                {
                    id: '98.0',
                    name: 'FBR-000643'
                },
                {
                    id: '99.0',
                    name: 'FBR-000644'
                },
                {
                    id: '100.0',
                    name: 'FBR-000645'
                },
                {
                    id: '101.0',
                    name: 'FBR-000646'
                },
                {
                    id: '102.0',
                    name: 'FBR-000647'
                },
                {
                    id: '103.0',
                    name: 'FBR-000648'
                },
                {
                    id: '104.0',
                    name: 'FBR-000649'
                },
                {
                    id: '105.0',
                    name: 'FBR-000651'
                },
                {
                    id: '106.0',
                    name: 'FBR-000652'
                },
                {
                    id: '107.0',
                    name: 'FBR-000653'
                },
                {
                    id: '108.0',
                    name: 'FBR-000654'
                },
                {
                    id: '109.0',
                    name: 'FBR-000655'
                },
                {
                    id: '110.0',
                    name: 'FBR-000656'
                },
                {
                    id: '111.0',
                    name: 'FBR-000657'
                },
                {
                    id: '112.0',
                    name: 'FBR-000658'
                },
                {
                    id: '113.0',
                    name: 'FBR-000659'
                },
                {
                    id: '114.0',
                    name: 'FBR-000660'
                },
                {
                    id: '115.0',
                    name: 'FBR-000661'
                },
                {
                    id: '116.0',
                    name: 'FBR-000662'
                },
                {
                    id: '117.0',
                    name: 'FBR-000663'
                },
                {
                    id: '118.0',
                    name: 'FBR-000664'
                },
                {
                    id: '119.0',
                    name: 'FBR-000665'
                },
                {
                    id: '120.0',
                    name: 'FBR-000666'
                },
                {
                    id: '121.0',
                    name: 'FBR-000667'
                },
                {
                    id: '122.0',
                    name: 'FBR-000668'
                },
                {
                    id: '123.0',
                    name: 'FBR-000669'
                },
                {
                    id: '124.0',
                    name: 'FBR-000670'
                },
                {
                    id: '125.0',
                    name: 'FBR-000672'
                },
                {
                    id: '126.0',
                    name: 'FBR-000673'
                },
                {
                    id: '127.0',
                    name: 'FBR-000674'
                },
                {
                    id: '128.0',
                    name: 'FBR-000675'
                },
                {
                    id: '129.0',
                    name: 'FBR-000676'
                },
                {
                    id: '130.0',
                    name: 'FBR-000677'
                },
                {
                    id: '131.0',
                    name: 'FBR-000918'
                },
                {
                    id: '132.0',
                    name: 'FBR-000650'
                },
                {
                    id: '133.0',
                    name: 'FBR-001003'
                },
                {
                    id: '134.0',
                    name: 'FBR-001007'
                },
                {
                    id: '135.0',
                    name: 'FBR-001023'
                },
                {
                    id: '136.0',
                    name: 'FBR-001024'
                },
                {
                    id: '137.0',
                    name: 'FBR-001046'
                },
                {
                    id: '138.0',
                    name: 'FBR-001047'
                },
                {
                    id: '139.0',
                    name: 'FBR-001080'
                },
                {
                    id: '140.0',
                    name: 'FBR-001083'
                },
                {
                    id: '141.0',
                    name: 'FBR-001084'
                },
                {
                    id: '142.0',
                    name: 'FBR-000097'
                },
                {
                    id: '143.0',
                    name: 'FBR-000102'
                },
                {
                    id: '144.0',
                    name: 'FBR-000105'
                },
                {
                    id: '145.0',
                    name: 'FBR-000107'
                },
                {
                    id: '146.0',
                    name: 'FBR-000108'
                },
                {
                    id: '147.0',
                    name: 'FBR-000109'
                },
                {
                    id: '148.0',
                    name: 'FBR-000111'
                },
                {
                    id: '149.0',
                    name: 'FBR-000113'
                },
                {
                    id: '150.0',
                    name: 'FBR-000114'
                },
                {
                    id: '151.0',
                    name: 'FBR-000115'
                },
                {
                    id: '152.0',
                    name: 'FBR-000116'
                },
                {
                    id: '153.0',
                    name: 'FBR-000125'
                },
                {
                    id: '154.0',
                    name: 'FBR-000126'
                },
                {
                    id: '155.0',
                    name: 'FBR-000131'
                },
                {
                    id: '157.0',
                    name: 'FBR-000606'
                },
                {
                    id: '158.0',
                    name: 'FBR-000607'
                },
                {
                    id: '159.0',
                    name: 'FBR-000948'
                },
                {
                    id: '160.0',
                    name: 'FBR-000979'
                },
                {
                    id: '161.0',
                    name: 'FBR-000980'
                },
                {
                    id: '162.0',
                    name: 'FBR-000101'
                },
                {
                    id: '163.0',
                    name: 'FBR-001020'
                },
                {
                    id: '164.0',
                    name: 'FBR-001035'
                },
                {
                    id: '165.0',
                    name: 'FBR-001036'
                },
                {
                    id: '166.0',
                    name: 'FBR-001044'
                },
                {
                    id: '167.0',
                    name: 'FBR-001045'
                },
                {
                    id: '168.0',
                    name: 'FBR-001057'
                },
                {
                    id: '169.0',
                    name: 'FBR-001058'
                },
                {
                    id: '170.0',
                    name: 'FBR-001082'
                },
                {
                    id: '171.0',
                    name: 'FBR-001087'
                },
                {
                    id: '172.0',
                    name: 'FBR-001088'
                },
                {
                    id: '173.0',
                    name: 'FBR-001089'
                },
                {
                    id: '174.0',
                    name: 'FBR-000157'
                },
                {
                    id: '175.0',
                    name: 'FBR-000160'
                },
                {
                    id: '176.0',
                    name: 'FBR-000162'
                },
                {
                    id: '177.0',
                    name: 'FBR-000164'
                },
                {
                    id: '178.0',
                    name: 'FBR-000165'
                },
                {
                    id: '179.0',
                    name: 'FBR-000167'
                },
                {
                    id: '180.0',
                    name: 'FBR-000168'
                },
                {
                    id: '181.0',
                    name: 'FBR-000171'
                },
                {
                    id: '183.0',
                    name: 'FBR-000448'
                },
                {
                    id: '184.0',
                    name: 'FBR-000969'
                },
                {
                    id: '185.0',
                    name: 'FBR-000973'
                },
                {
                    id: '186.0',
                    name: 'FBR-000975'
                },
                {
                    id: '187.0',
                    name: 'FBR-000176'
                },
                {
                    id: '188.0',
                    name: 'FBR-000177'
                },
                {
                    id: '189.0',
                    name: 'FBR-000180'
                },
                {
                    id: '191.0',
                    name: 'FBR-000184'
                },
                {
                    id: '192.0',
                    name: 'FBR-000185'
                },
                {
                    id: '193.0',
                    name: 'FBR-000186'
                },
                {
                    id: '194.0',
                    name: 'FBR-000189'
                },
                {
                    id: '195.0',
                    name: 'FBR-000191'
                },
                {
                    id: '196.0',
                    name: 'FBR-000194'
                },
                {
                    id: '197.0',
                    name: 'FBR-000196'
                },
                {
                    id: '198.0',
                    name: 'FBR-000197'
                },
                {
                    id: '199.0',
                    name: 'FBR-000198'
                },
                {
                    id: '200.0',
                    name: 'FBR-000202'
                },
                {
                    id: '201.0',
                    name: 'FBR-000203'
                },
                {
                    id: '202.0',
                    name: 'FBR-000205'
                },
                {
                    id: '203.0',
                    name: 'FBR-000206'
                },
                {
                    id: '204.0',
                    name: 'FBR-000211'
                },
                {
                    id: '205.0',
                    name: 'FBR-000221'
                },
                {
                    id: '206.0',
                    name: 'FBR-000226'
                },
                {
                    id: '207.0',
                    name: 'FBR-000231'
                },
                {
                    id: '208.0',
                    name: 'FBR-000232'
                },
                {
                    id: '209.0',
                    name: 'FBR-000241'
                },
                {
                    id: '210.0',
                    name: 'FBR-000245'
                },
                {
                    id: '211.0',
                    name: 'FBR-000248'
                },
                {
                    id: '212.0',
                    name: 'FBR-000249'
                },
                {
                    id: '213.0',
                    name: 'FBR-000255'
                },
                {
                    id: '214.0',
                    name: 'FBR-000256'
                },
                {
                    id: '215.0',
                    name: 'FBR-000257'
                },
                {
                    id: '216.0',
                    name: 'FBR-000258'
                },
                {
                    id: '217.0',
                    name: 'FBR-000259'
                },
                {
                    id: '218.0',
                    name: 'FBR-000260'
                },
                {
                    id: '219.0',
                    name: 'FBR-000261'
                },
                {
                    id: '220.0',
                    name: 'FBR-000263'
                },
                {
                    id: '221.0',
                    name: 'FBR-000264'
                },
                {
                    id: '222.0',
                    name: 'FBR-000265'
                },
                {
                    id: '223.0',
                    name: 'FBR-000266'
                },
                {
                    id: '224.0',
                    name: 'FBR-000267'
                },
                {
                    id: '225.0',
                    name: 'FBR-000270'
                },
                {
                    id: '226.0',
                    name: 'FBR-000275'
                },
                {
                    id: '227.0',
                    name: 'FBR-000276'
                },
                {
                    id: '228.0',
                    name: 'FBR-000278'
                },
                {
                    id: '229.0',
                    name: 'FBR-000279'
                },
                {
                    id: '230.0',
                    name: 'FBR-000281'
                },
                {
                    id: '231.0',
                    name: 'FBR-000283'
                },
                {
                    id: '232.0',
                    name: 'FBR-000285'
                },
                {
                    id: '233.0',
                    name: 'FBR-000287'
                },
                {
                    id: '234.0',
                    name: 'FBR-000292'
                },
                {
                    id: '235.0',
                    name: 'FBR-000293'
                },
                {
                    id: '236.0',
                    name: 'FBR-000302'
                },
                {
                    id: '237.0',
                    name: 'FBR-000305'
                },
                {
                    id: '238.0',
                    name: 'FBR-000309'
                },
                {
                    id: '239.0',
                    name: 'FBR-000310'
                },
                {
                    id: '240.0',
                    name: 'FBR-000316'
                },
                {
                    id: '241.0',
                    name: 'FBR-000317'
                },
                {
                    id: '242.0',
                    name: 'FBR-000318'
                },
                {
                    id: '243.0',
                    name: 'FBR-000323'
                },
                {
                    id: '244.0',
                    name: 'FBR-000325'
                },
                {
                    id: '245.0',
                    name: 'FBR-000326'
                },
                {
                    id: '246.0',
                    name: 'FBR-000328'
                },
                {
                    id: '247.0',
                    name: 'FBR-000329'
                },
                {
                    id: '249.0',
                    name: 'FBR-000333'
                },
                {
                    id: '250.0',
                    name: 'FBR-000337'
                },
                {
                    id: '251.0',
                    name: 'FBR-000338'
                },
                {
                    id: '252.0',
                    name: 'FBR-000339'
                },
                {
                    id: '253.0',
                    name: 'FBR-000341'
                },
                {
                    id: '254.0',
                    name: 'FBR-000342'
                },
                {
                    id: '255.0',
                    name: 'FBR-000346'
                },
                {
                    id: '256.0',
                    name: 'FBR-000595'
                },
                {
                    id: '257.0',
                    name: 'FBR-000611'
                },
                {
                    id: '258.0',
                    name: 'FBR-000612'
                },
                {
                    id: '259.0',
                    name: 'FBR-000613'
                },
                {
                    id: '260.0',
                    name: 'FBR-000614'
                },
                {
                    id: '261.0',
                    name: 'FBR-000615'
                },
                {
                    id: '262.0',
                    name: 'FBR-000616'
                },
                {
                    id: '263.0',
                    name: 'FBR-000617'
                },
                {
                    id: '264.0',
                    name: 'FBR-000618'
                },
                {
                    id: '265.0',
                    name: 'FBR-000708'
                },
                {
                    id: '266.0',
                    name: 'FBR-000874'
                },
                {
                    id: '267.0',
                    name: 'FBR-000878'
                },
                {
                    id: '268.0',
                    name: 'FBR-000884'
                },
                {
                    id: '269.0',
                    name: 'FBR-000896'
                },
                {
                    id: '270.0',
                    name: 'FBR-000899'
                },
                {
                    id: '271.0',
                    name: 'FBR-000900'
                },
                {
                    id: '272.0',
                    name: 'FBR-000921'
                },
                {
                    id: '273.0',
                    name: 'FBR-000922'
                },
                {
                    id: '274.0',
                    name: 'FBR-000923'
                },
                {
                    id: '275.0',
                    name: 'FBR-000941'
                },
                {
                    id: '276.0',
                    name: 'FBR-000959'
                },
                {
                    id: '277.0',
                    name: 'FBR-000960'
                },
                {
                    id: '278.0',
                    name: 'FBR-000968'
                },
                {
                    id: '279.0',
                    name: 'FBR-000970'
                },
                {
                    id: '280.0',
                    name: 'FBR-000972'
                },
                {
                    id: '281.0',
                    name: 'FBR-000978'
                },
                {
                    id: '282.0',
                    name: 'FBR-000985'
                },
                {
                    id: '283.0',
                    name: 'FBR-000986'
                },
                {
                    id: '284.0',
                    name: 'FBR-000988'
                },
                {
                    id: '285.0',
                    name: 'FBR-000990'
                },
                {
                    id: '286.0',
                    name: 'FBR-000994'
                },
                {
                    id: '287.0',
                    name: 'FBR-001000'
                },
                {
                    id: '288.0',
                    name: 'FBR-001005'
                },
                {
                    id: '289.0',
                    name: 'FBR-001010'
                },
                {
                    id: '290.0',
                    name: 'FBR-001011'
                },
                {
                    id: '291.0',
                    name: 'FBR-001012'
                },
                {
                    id: '292.0',
                    name: 'FBR-001015'
                },
                {
                    id: '296.0',
                    name: 'FBR-001021'
                },
                {
                    id: '297.0',
                    name: 'FBR-001022'
                },
                {
                    id: '298.0',
                    name: 'FBR-001027'
                },
                {
                    id: '299.0',
                    name: 'FBR-001029'
                },
                {
                    id: '300.0',
                    name: 'FBR-001030'
                },
                {
                    id: '301.0',
                    name: 'FBR-001031'
                },
                {
                    id: '302.0',
                    name: 'FBR-001032'
                },
                {
                    id: '303.0',
                    name: 'FBR-001033'
                },
                {
                    id: '304.0',
                    name: 'FBR-001034'
                },
                {
                    id: '305.0',
                    name: 'FBR-001039'
                },
                {
                    id: '306.0',
                    name: 'FBR-001040'
                },
                {
                    id: '307.0',
                    name: 'FBR-001041'
                },
                {
                    id: '308.0',
                    name: 'FBR-001048'
                },
                {
                    id: '309.0',
                    name: 'FBR-001060'
                },
                {
                    id: '310.0',
                    name: 'FBR-001061'
                },
                {
                    id: '311.0',
                    name: 'FBR-001062'
                },
                {
                    id: '312.0',
                    name: 'FBR-001065'
                },
                {
                    id: '313.0',
                    name: 'FBR-001066'
                },
                {
                    id: '314.0',
                    name: 'FBR-001067'
                },
                {
                    id: '315.0',
                    name: 'FBR-001068'
                },
                {
                    id: '316.0',
                    name: 'FBR-001069'
                },
                {
                    id: '317.0',
                    name: 'FBR-001070'
                },
                {
                    id: '318.0',
                    name: 'FBR-001071'
                },
                {
                    id: '319.0',
                    name: 'FBR-001072'
                },
                {
                    id: '320.0',
                    name: 'FBR-001073'
                },
                {
                    id: '321.0',
                    name: 'FBR-001074'
                },
                {
                    id: '322.0',
                    name: 'FBR-001075'
                },
                {
                    id: '323.0',
                    name: 'FBR-001076'
                },
                {
                    id: '324.0',
                    name: 'FBR-001077'
                },
                {
                    id: '325.0',
                    name: 'FBR-001078'
                },
                {
                    id: '326.0',
                    name: 'FBR-001079'
                },
                {
                    id: '327.0',
                    name: 'FBR-001081'
                },
                {
                    id: '328.0',
                    name: 'FBR-001085'
                },
                {
                    id: '329.0',
                    name: 'FBR-001086'
                },
                {
                    id: '330.0',
                    name: 'FBR-000132'
                },
                {
                    id: '331.0',
                    name: 'FBR-000134'
                },
                {
                    id: '332.0',
                    name: 'FBR-000135'
                },
                {
                    id: '333.0',
                    name: 'FBR-000136'
                },
                {
                    id: '334.0',
                    name: 'FBR-000137'
                },
                {
                    id: '335.0',
                    name: 'FBR-000138'
                },
                {
                    id: '336.0',
                    name: 'FBR-000139'
                },
                {
                    id: '337.0',
                    name: 'FBR-000140'
                },
                {
                    id: '338.0',
                    name: 'FBR-000141'
                },
                {
                    id: '339.0',
                    name: 'FBR-000142'
                },
                {
                    id: '341.0',
                    name: 'FBR-000145'
                },
                {
                    id: '342.0',
                    name: 'FBR-000146'
                },
                {
                    id: '343.0',
                    name: 'FBR-000147'
                },
                {
                    id: '344.0',
                    name: 'FBR-000148'
                },
                {
                    id: '345.0',
                    name: 'FBR-000151'
                },
                {
                    id: '346.0',
                    name: 'FBR-000152'
                },
                {
                    id: '347.0',
                    name: 'FBR-000154'
                },
                {
                    id: '348.0',
                    name: 'FBR-000155'
                },
                {
                    id: '350.0',
                    name: 'FBR-000609'
                },
                {
                    id: '351.0',
                    name: 'FBR-000610'
                },
                {
                    id: '352.0',
                    name: 'FBR-000877'
                },
                {
                    id: '353.0',
                    name: 'FBR-001004'
                },
                {
                    id: '354.0',
                    name: 'FBR-001008'
                },
                {
                    id: '355.0',
                    name: 'FBR-001009'
                },
                {
                    id: '357.0',
                    name: 'FBR-001026'
                },
                {
                    id: '358.0',
                    name: 'FBR-001049'
                },
                {
                    id: '359.0',
                    name: 'FBR-001050'
                },
                {
                    id: '360.0',
                    name: 'FBR-001051'
                },
                {
                    id: '361.0',
                    name: 'FBR-001052'
                },
                {
                    id: '362.0',
                    name: 'FBR-001054'
                },
                {
                    id: '364.0',
                    name: 'FBR-000348'
                },
                {
                    id: '365.0',
                    name: 'FBR-000349'
                },
                {
                    id: '366.0',
                    name: 'FBR-000350'
                },
                {
                    id: '367.0',
                    name: 'FBR-000352'
                },
                {
                    id: '368.0',
                    name: 'FBR-000353'
                },
                {
                    id: '369.0',
                    name: 'FBR-000354'
                },
                {
                    id: '370.0',
                    name: 'FBR-000355'
                },
                {
                    id: '371.0',
                    name: 'FBR-000358'
                },
                {
                    id: '372.0',
                    name: 'FBR-000359'
                },
                {
                    id: '373.0',
                    name: 'FBR-000360'
                },
                {
                    id: '374.0',
                    name: 'FBR-000361'
                },
                {
                    id: '375.0',
                    name: 'FBR-000363'
                },
                {
                    id: '376.0',
                    name: 'FBR-000364'
                },
                {
                    id: '377.0',
                    name: 'FBR-000368'
                },
                {
                    id: '378.0',
                    name: 'FBR-000369'
                },
                {
                    id: '379.0',
                    name: 'FBR-000375'
                },
                {
                    id: '380.0',
                    name: 'FBR-000377'
                },
                {
                    id: '381.0',
                    name: 'FBR-000379'
                },
                {
                    id: '382.0',
                    name: 'FBR-000596'
                },
                {
                    id: '383.0',
                    name: 'FBR-000869'
                },
                {
                    id: '384.0',
                    name: 'FBR-000871'
                },
                {
                    id: '385.0',
                    name: 'FBR-000908'
                },
                {
                    id: '386.0',
                    name: 'FBR-000909'
                },
                {
                    id: '387.0',
                    name: 'FBR-000919'
                },
                {
                    id: '388.0',
                    name: 'FBR-000976'
                },
                {
                    id: '389.0',
                    name: 'FBR-000977'
                },
                {
                    id: '390.0',
                    name: 'FBR-000989'
                },
                {
                    id: '391.0',
                    name: 'FBR-000993'
                },
                {
                    id: '393.0',
                    name: 'FBR-001025'
                },
                {
                    id: '394.0',
                    name: 'FBR-001043'
                },
                {
                    id: '395.0',
                    name: 'FBR-001053'
                },
                {
                    id: '396.0',
                    name: 'FBR-001063'
                },
                {
                    id: '397.0',
                    name: 'FBR-001064'
                },
                {
                    id: '398.0',
                    name: 'FBR-000380'
                },
                {
                    id: '399.0',
                    name: 'FBR-000381'
                },
                {
                    id: '400.0',
                    name: 'FBR-000384'
                },
                {
                    id: '401.0',
                    name: 'FBR-000395'
                },
                {
                    id: '402.0',
                    name: 'FBR-000396'
                },
                {
                    id: '403.0',
                    name: 'FBR-000398'
                },
                {
                    id: '404.0',
                    name: 'FBR-000399'
                },
                {
                    id: '405.0',
                    name: 'FBR-000400'
                },
                {
                    id: '406.0',
                    name: 'FBR-000402'
                },
                {
                    id: '407.0',
                    name: 'FBR-000403'
                },
                {
                    id: '408.0',
                    name: 'FBR-000404'
                },
                {
                    id: '409.0',
                    name: 'FBR-000405'
                },
                {
                    id: '410.0',
                    name: 'FBR-000406'
                },
                {
                    id: '411.0',
                    name: 'FBR-000407'
                },
                {
                    id: '412.0',
                    name: 'FBR-000411'
                },
                {
                    id: '413.0',
                    name: 'FBR-000412'
                },
                {
                    id: '414.0',
                    name: 'FBR-000425'
                },
                {
                    id: '415.0',
                    name: 'FBR-000426'
                },
                {
                    id: '416.0',
                    name: 'FBR-000427'
                },
                {
                    id: '417.0',
                    name: 'FBR-000428'
                },
                {
                    id: '418.0',
                    name: 'FBR-000429'
                },
                {
                    id: '419.0',
                    name: 'FBR-000597'
                },
                {
                    id: '420.0',
                    name: 'FBR-000598'
                },
                {
                    id: '421.0',
                    name: 'FBR-000599'
                },
                {
                    id: '422.0',
                    name: 'FBR-000600'
                },
                {
                    id: '423.0',
                    name: 'FBR-000602'
                },
                {
                    id: '424.0',
                    name: 'FBR-000603'
                },
                {
                    id: '425.0',
                    name: 'FBR-000912'
                },
                {
                    id: '426.0',
                    name: 'FBR-000913'
                },
                {
                    id: '427.0',
                    name: 'FBR-000944'
                },
                {
                    id: '428.0',
                    name: 'FBR-000962'
                },
                {
                    id: '429.0',
                    name: 'FBR-000963'
                },
                {
                    id: '430.0',
                    name: 'FBR-000964'
                },
                {
                    id: '431.0',
                    name: 'FBR-000965'
                },
                {
                    id: '432.0',
                    name: 'FBR-000966'
                },
                {
                    id: '433.0',
                    name: 'FBR-000967'
                },
                {
                    id: '434.0',
                    name: 'FBR-000971'
                },
                {
                    id: '435.0',
                    name: 'FBR-000992'
                },
                {
                    id: '436.0',
                    name: 'FBR-000995'
                },
                {
                    id: '437.0',
                    name: 'FBR-000996'
                },
                {
                    id: '438.0',
                    name: 'FBR-000997'
                },
                {
                    id: '439.0',
                    name: 'FBR-000998'
                },
                {
                    id: '440.0',
                    name: 'FBR-001001'
                },
                {
                    id: '441.0',
                    name: 'FBR-001002'
                },
                {
                    id: '442.0',
                    name: 'FBR-001042'
                },
                {
                    id: '443.0',
                    name: 'FBR-001055'
                },
                {
                    id: '444.0',
                    name: 'FBR-001059'
                },
                {
                    id: '445.0',
                    name: 'FBR-000119'
                },
                {
                    id: '446.0',
                    name: 'FBR-001107'
                },
                {
                    id: '447.0',
                    name: 'FBR-001108'
                },
                {
                    id: '448.0',
                    name: 'FBR-001109'
                },
                {
                    id: '449.0',
                    name: 'FBR-001112'
                },
                {
                    id: '450.0',
                    name: 'FBR-001098'
                },
                {
                    id: '451.0',
                    name: 'FBR-001090'
                },
                {
                    id: '452.0',
                    name: 'FBR-001104'
                },
                {
                    id: '453.0',
                    name: 'FBR-001091'
                },
                {
                    id: '454.0',
                    name: 'FBR-001094'
                },
                {
                    id: '455.0',
                    name: 'FBR-001106'
                },
                {
                    id: '456.0',
                    name: 'FBR-001099'
                },
                {
                    id: '457.0',
                    name: 'FBR-001100'
                },
                {
                    id: '458.0',
                    name: 'FBR-001101'
                },
                {
                    id: '459.0',
                    name: 'FBR-001102'
                },
                {
                    id: '460.0',
                    name: 'FBR-001105'
                },
                {
                    id: '461.0',
                    name: 'FBR-001095'
                },
                {
                    id: '462.0',
                    name: 'FBR-000910'
                },
                {
                    id: '463.0',
                    name: 'FBR-001103'
                },
                {
                    id: '464.0',
                    name: 'FBR-001016'
                },
                {
                    id: '465.0',
                    name: 'FBR-001018'
                },
                {
                    id: '466.0',
                    name: 'FBR-001019'
                },
                {
                    id: '467.0',
                    name: 'FBR-001013'
                },
                {
                    id: '468.0',
                    name: 'FBR-000001'
                },
                {
                    id: '469.0',
                    name: 'FBR-001110'
                },
                {
                    id: '470.0',
                    name: 'FBR-001096'
                },
                {
                    id: '471.0',
                    name: 'FBR-001111'
                },
                {
                    id: '472.0',
                    name: 'FBR-001097'
                },
                {
                    id: '473.0',
                    name: 'FBR-001093'
                },
                {
                    id: '474.0',
                    name: 'FBR-000386'
                },
                {
                    id: '475.0',
                    name: 'FBR-001115'
                },
                {
                    id: '476.0',
                    name: 'FBR-001113'
                },
                {
                    id: '477.0',
                    name: 'FBR-001092'
                },
                {
                    id: '478.0',
                    name: 'FBR-000192'
                },
                {
                    id: '479.0',
                    name: 'FBR-001038'
                },
                {
                    id: '480.0',
                    name: 'FBR-000019'
                },
                {
                    id: '481.0',
                    name: 'FBR-000875'
                },
                {
                    id: '482.0',
                    name: 'FBR-000158'
                },
                {
                    id: '483.0',
                    name: 'FBR-000187'
                },
                {
                    id: '484.0',
                    name: 'FBR-000188'
                },
                {
                    id: '485.0',
                    name: 'FBR-000207'
                },
                {
                    id: '486.0',
                    name: 'FBR-000210'
                },
                {
                    id: '487.0',
                    name: 'FBR-000217'
                },
                {
                    id: '488.0',
                    name: 'FBR-000219'
                },
                {
                    id: '489.0',
                    name: 'FBR-000224'
                },
                {
                    id: '490.0',
                    name: 'FBR-000234'
                },
                {
                    id: '491.0',
                    name: 'FBR-000235'
                },
                {
                    id: '492.0',
                    name: 'FBR-000236'
                },
                {
                    id: '493.0',
                    name: 'FBR-000242'
                },
                {
                    id: '494.0',
                    name: 'FBR-000250'
                },
                {
                    id: '495.0',
                    name: 'FBR-000268'
                },
                {
                    id: '496.0',
                    name: 'FBR-000274'
                },
                {
                    id: '497.0',
                    name: 'FBR-000879'
                },
                {
                    id: '498.0',
                    name: 'FBR-000880'
                },
                {
                    id: '499.0',
                    name: 'FBR-000881'
                },
                {
                    id: '500.0',
                    name: 'FBR-000882'
                },
                {
                    id: '501.0',
                    name: 'FBR-000883'
                },
                {
                    id: '502.0',
                    name: 'FBR-000885'
                },
                {
                    id: '503.0',
                    name: 'FBR-000886'
                },
                {
                    id: '504.0',
                    name: 'FBR-000887'
                },
                {
                    id: '505.0',
                    name: 'FBR-000888'
                },
                {
                    id: '506.0',
                    name: 'FBR-000890'
                },
                {
                    id: '507.0',
                    name: 'FBR-000892'
                },
                {
                    id: '508.0',
                    name: 'FBR-000893'
                },
                {
                    id: '509.0',
                    name: 'FBR-000894'
                },
                {
                    id: '510.0',
                    name: 'FBR-000895'
                },
                {
                    id: '511.0',
                    name: 'FBR-000897'
                },
                {
                    id: '512.0',
                    name: 'FBR-000898'
                },
                {
                    id: '513.0',
                    name: 'FBR-000901'
                },
                {
                    id: '514.0',
                    name: 'FBR-000902'
                },
                {
                    id: '515.0',
                    name: 'FBR-000903'
                },
                {
                    id: '516.0',
                    name: 'FBR-000904'
                },
                {
                    id: '517.0',
                    name: 'FBR-000905'
                },
                {
                    id: '518.0',
                    name: 'FBR-000949'
                },
                {
                    id: '519.0',
                    name: 'FBR-000987'
                },
                {
                    id: '520.0',
                    name: 'FBR-000284'
                },
                {
                    id: '521.0',
                    name: 'FBR-000327'
                },
                {
                    id: '522.0',
                    name: 'FBR-000199'
                },
                {
                    id: '523.0',
                    name: 'FBR-000286'
                },
                {
                    id: '524.0',
                    name: 'FBR-000290'
                },
                {
                    id: '525.0',
                    name: 'FBR-000282'
                },
                {
                    id: '526.0',
                    name: 'FBR-000280'
                },
                {
                    id: '527.0',
                    name: 'FBR-000991'
                },
                {
                    id: '528.0',
                    name: 'FBR-001037'
                },
                {
                    id: '529.0',
                    name: 'FBR-000351'
                },
                {
                    id: '530.0',
                    name: 'FBR-000356'
                },
                {
                    id: '531.0',
                    name: 'FBR-000715'
                },
                {
                    id: '532.0',
                    name: 'FBR-000716'
                },
                {
                    id: '533.0',
                    name: 'FBR-000870'
                },
                {
                    id: '534.0',
                    name: 'FBR-000906'
                },
                {
                    id: '535.0',
                    name: 'FBR-000365'
                },
                {
                    id: '536.0',
                    name: 'FBR-000383'
                },
                {
                    id: '537.0',
                    name: 'FBR-000397'
                },
                {
                    id: '538.0',
                    name: 'FBR-000418'
                },
                {
                    id: '539.0',
                    name: 'FBR-000420'
                },
                {
                    id: '540.0',
                    name: 'FBR-000421'
                },
                {
                    id: '541.0',
                    name: 'FBR-000422'
                },
                {
                    id: '542.0',
                    name: 'FBR-000423'
                },
                {
                    id: '543.0',
                    name: 'FBR-000393'
                },
                {
                    id: '544.0',
                    name: 'FBR-001014'
                },
                {
                    id: '545.0',
                    name: 'FBR-001017'
                },
                {
                    id: '546.0',
                    name: 'FBR-001116'
                },
                {
                    id: '547.0',
                    name: 'FBR-001117'
                },
                {
                    id: '548.0',
                    name: 'FBR-001118'
                },
                {
                    id: '549.0',
                    name: 'FBR-001119'
                },
                {
                    id: '550.0',
                    name: 'FBR-001120'
                },
                {
                    id: '551.0',
                    name: 'FBR-001121'
                },
                {
                    id: '552.0',
                    name: 'FBR-001122'
                },
                {
                    id: '553.0',
                    name: 'FBR-001123'
                },
                {
                    id: '554.0',
                    name: 'FBR-001124'
                },
                {
                    id: '555.0',
                    name: 'FBR-001125'
                },
                {
                    id: '556.0',
                    name: 'FBR-001126'
                },
                {
                    id: '557.0',
                    name: 'FBR-001127'
                },
                {
                    id: '558.0',
                    name: 'FBR-001128'
                },
                {
                    id: '559.0',
                    name: 'FBR-001129'
                },
                {
                    id: '560.0',
                    name: 'FBR-001130'
                }
            ],
        }, {
            type: 'anticipatedAwardType',
            data: [
                {
                    id: '1.0',
                    name: 'New - Type 1'
                },
                {
                    id: '2.0',
                    name: 'Supplement (Administrative Increase or Program Expansion) Type 3'
                },
                {
                    id: '3.0',
                    name: 'Non-Competing Continuation - Type 5'
                },
                {
                    id: '4.0',
                    name: 'Competing Continuation - Type 2'
                }
            ]
        }, {
            type: 'grantStatus',
            data: [
                {
                    id: '1.0',
                    name: 'Active'
                },
                {
                    id: '2.0',
                    name: 'Cancelled'
                }
            ],
        },
        {
            type: 'acquisitionStatus',
            data: [
                {
                    id: '1.0',
                    name: 'Active'
                },
                {
                    id: '2.0',
                    name: 'Cancelled'
                }
            ],
        }, {
            type: 'zeroDollarReq',
            data: [
                {
                    id: '1.0',
                    name: 'Yes'
                },
                {
                    id: '2.0',
                    name: 'No'
                }
            ]
        }, {
            type: 'collaborationFlag',
            data: [
                {
                    id: '1.0',
                    name: 'Yes'
                },
                {
                    id: '2.0',
                    name: 'No'
                }
            ]
        }, {
            type: 'priorityLevel',
            data: [
                {
                    id: '1.0',
                    name: 'Mandatory (Required by Law)'
                },
                {
                    id: '2.0',
                    name: 'High'
                },
                {
                    id: '3.0',
                    name: 'Medium'
                },
                {
                    id: '4.0',
                    name: 'Low'
                }
            ]
        }, {
            type: 'recurringItem',
            data: [
                {
                    id: '1.0',
                    name: 'Yes'
                },
                {
                    id: '2.0',
                    name: 'No'
                }
            ]
        }, {
            type: 'soleSource',
            data: [
                {
                    id: '1.0',
                    name: 'Yes'
                },
                {
                    id: '2.0',
                    name: 'No'
                }
            ]
        }, {
            type: 'humanSubjects',
            data: [
                {
                    id: '1.0',
                    name: 'Yes'
                },
                {
                    id: '2.0',
                    name: 'No'
                }
            ]
        }, {
            type: 'animalSubjects',
            data: [
                {
                    id: '1.0',
                    name: 'Yes'
                },
                {
                    id: '2.0',
                    name: 'No'
                }
            ]
        }, {
            type: 'colorcode',
            data: [
                {
                    id: '3.0',
                    name: 'Blue'
                },
                {
                    id: '4.0',
                    name: 'Yellow'
                },
                {
                    id: '5.0',
                    name: 'Red'
                },
                {
                    id: '6.0',
                    name: 'Green'
                }
            ]
        }, {
            type: 'anticipatedActionType',
            data: [
                {
                    id: '1.0',
                    name: 'IDIQ - Competitive'
                },
                {
                    id: '2.0',
                    name: 'BPA - Competitive'
                },
                {
                    id: '3.0',
                    name: 'Stand Alone Contract - Competitive'
                },
                {
                    id: '4.0',
                    name: 'IDIQ - Non Competitive'
                },
                {
                    id: '5.0',
                    name: 'BPA - Non Competitive'
                },
                {
                    id: '6.0',
                    name: 'Stand Alone Contract - Non Competitive'
                },
                {
                    id: '7.0',
                    name: 'TO/DO - Competitive'
                },
                {
                    id: '8.0',
                    name: 'TO/DO - Non Competitive'
                },
                {
                    id: '9.0',
                    name: '8(a) Contracts - Non Competitive'
                },
                {
                    id: '11.0',
                    name: 'GSA/GWAC Services, NO SOW'
                },
                {
                    id: '12.0',
                    name: 'GSA/GWAC for Services Requiring a SOW'
                },
                {
                    id: '13.0',
                    name: 'Simplified Acquisition ($25001 - $250000)'
                },
                {
                    id: '14.0',
                    name: 'Option Exercise'
                },
                {
                    id: '16.0',
                    name: 'Bilateral Contract Modification'
                },
                {
                    id: '17.0',
                    name: 'HHS Strategic Sourcing BPA TO/DO - Non Competitive'
                },
                {
                    id: '18.0',
                    name: 'Basic Ordering Agreement'
                },
                {
                    id: '19.0',
                    name: 'Broad Agency Announcement'
                },
                {
                    id: '20.0',
                    name: 'Simplified Acquisition ($10001 to $25000)'
                },
                {
                    id: '21.0',
                    name: 'Simplified Acquisition Micropurchase <=10000'
                },
                {
                    id: '22.0',
                    name: 'Unilateral Modification'
                },
                {
                    id: '23.0',
                    name: 'Advanced Purchase Card Purchase ($3501 - $25000)'
                }
            ]
        }, {
            type: 'altCorCertLevel',
            data: [
                {
                    id: '1.0',
                    name: 'I'
                },
                {
                    id: '2.0',
                    name: 'II'
                },
                {
                    id: '3.0',
                    name: 'III'
                }
            ]
        }, {
            type: 'corCertLevel',
            data: [
                {
                    id: '1.0',
                    name: 'I'
                },
                {
                    id: '2.0',
                    name: 'II'
                },
                {
                    id: '3.0',
                    name: 'III'
                }
            ]
        }, {
            type: 'papworkRedAct',
            data: [
                {
                    id: '1.0',
                    name: 'Yes'
                },
                {
                    id: '2.0',
                    name: 'No'
                }
            ]
        }, {
            type: 'pubOfScintResearch',
            data: [
                {
                    id: '1.0',
                    name: 'Yes'
                },
                {
                    id: '2.0',
                    name: 'No'
                }
            ]
        }, {
            type: 'conferenceSupport',
            data: [
                {
                    id: '1.0',
                    name: 'Yes'
                },
                {
                    id: '2.0',
                    name: 'No'
                }
            ]
        }, {
            type: 'smallBusinessSetAside',
            data: [
                {
                    id: '1.0',
                    name: 'Yes'
                },
                {
                    id: '2.0',
                    name: 'No'
                }
            ]
        }, {
            type: 'smallBusinessInitiative',
            data: [
                {
                    id: '1.0',
                    name: 'Yes'
                },
                {
                    id: '2.0',
                    name: 'No'
                }
            ]
        }, {
            type: 'advancedPurchaseCard',
            data: [
                {
                    id: '1.0',
                    name: 'Yes'
                },
                {
                    id: '2.0',
                    name: 'No'
                },
                {
                    id: '3.0',
                    name: 'No'
                }
            ]
        }, {
            type: 'requirementType',
            data: [
                {
                    id: '1.0',
                    name: 'New Requirement'
                },
                {
                    id: '2.0',
                    name: 'Option Exercise'
                },
                {
                    id: '3.0',
                    name: 'Recompete'
                },
                {
                    id: '4.0',
                    name: 'TBD'
                }
            ]
        }, {
            type: 'optionYearExercise',
            data: [
                {
                    id: '1.0',
                    name: 'Base Year'
                },
                {
                    id: '2.0',
                    name: 'Option Year 1'
                },
                {
                    id: '3.0',
                    name: 'NA'
                },
                {
                    id: '4.0',
                    name: 'Option Year 3'
                }, {
                    id: '5.0',
                    name: 'Option Year 4'
                }, {
                    id: '6.0',
                    name: 'Option Year 2'
                }
            ]
        }, {
            type: 'grantsAnticipatedActionType',
            data: [
                {
                    id: '1.0',
                    name: 'New - Type 1'
                },
                {
                    id: '2.0',
                    name: 'Supplement (Administrative Increase or Program Expansion) Type 3'
                },
                {
                    id: '3.0',
                    name: 'Non-Competing Continuation - Type 5'
                },
                {
                    id: '4.0',
                    name: 'Competing Continuation - Type 2'
                }
            ]
        }, {
            type: 'iaasAnticipatedActionType',
            data: [
                {
                    id: '1.0',
                    name: 'Assisted Acquisitions IAAs'
                },
                {
                    id: '2.0',
                    name: 'Service IAAs'
                },
                {
                    id: '3.0',
                    name: 'Reimbursable IAAs'
                },
                {
                    id: '4.0',
                    name: 'IDDA Grants Support IAA'
                }
            ]
        },
    ];

}
