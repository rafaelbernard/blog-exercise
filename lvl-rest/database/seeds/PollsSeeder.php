<?php

use Illuminate\Database\Seeder;

class PollsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $polls = [
            [
                'xid'            => 1,
                'title'          => 'Is bitcoin worth the time and money that mining requires?',
                'published_date' => 1516605447,
                'answer'         => [
                    'type'    => 'Single',
                    'options' => [[
                        'id'    => 1,
                        'label' => 'Yes'
                    ],
                        [
                            'id'    => 2,
                            'label' => 'No'
                        ]
                    ]
                ]
            ],
            [
                'xid'            => 2,
                'title'          => 'Should chatbots replace humans in customer service jobs?',
                'published_date' => 1516000647,
                'answer'         => [
                    'type'    => 'Single',
                    'options' => [[
                        'id'    => 3,
                        'label' => 'Yes'
                    ],
                        [
                            'id'    => 4,
                            'label' => 'No'
                        ]
                    ]
                ]
            ],
            [
                'xid'            => 3,
                'title'          => 'How are we feeling about 2018?',
                'published_date' => 1515568647,
                'answer'         => [
                    'type'    => 'Single',
                    'options' => [[
                        'id'    => 5,
                        'label' => 'Hopeful'
                    ],
                        [
                            'id'    => 6,
                            'label' => 'Doubtful'
                        ]
                    ]
                ]
            ],
            [
                'xid'            => 4,
                'title'          => 'Which country/region have you ever visited? (Select all that applies)',
                'published_date' => 1515482247,
                'answer'         => [
                    'type'    => 'Multi',
                    'options' => [[
                        'id'    => 7,
                        'label' => 'Hong Kong'
                    ],
                        [
                            'id'    => 8,
                            'label' => 'China'
                        ],
                        [
                            'id'    => 9,
                            'label' => 'Australia'
                        ],
                        [
                            'id'    => 10,
                            'label' => 'Thailand'
                        ],
                        [
                            'id'    => 11,
                            'label' => 'Korea'
                        ],
                        [
                            'id'    => 12,
                            'label' => 'Japan'
                        ]
                    ]
                ]
            ],
            [
                'xid'            => 5,
                'title'          => 'Will new benefits encourage you to study or work in mainland?',
                'published_date' => 1515309447,
                'answer'         => [
                    'type'    => 'Single',
                    'options' => [[
                        'id'    => 13,
                        'label' => 'Yes'
                    ],
                        [
                            'id'    => 14,
                            'label' => 'No'
                        ]
                    ]
                ]
            ]
        ];

        array_map(function ($poll) {
            App\Poll::create($poll);
        }, $polls);
    }
}
