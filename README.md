# indegene

after pulling the code please do npm install
project has been developed with current version of node v13.9.0
install mongodb in your local system before use and upload the given documents

apis : 

TASK 1

http://127.0.0.1:3000/authors/numberOfawards?n=3
db.collection('authors').find({"$and":[{"$nor":[{"awards":{"$size":0}},{"awards":{"$size":1}},{"awards":{"$size":2}}]},{"awards":{"$exists":true}}]}) for n = 3

TASK 2

http://127.0.0.1:3000/authors/yearsOfAward?y=1983.0
db.collection('authors').find({'awards.year': { $gte: yearOfAwards }})

TASK 3

http://127.0.0.1:3000/books/profit
db.collection('books').aggregate(
            [
                { 
                    $project: { 
                        authorId: 1, sold:1, total: { $multiply: [ "$sold", "$price" ] } 
                    }
                },
                {
                    $group: {
                        "_id":"$authorId", 
                        "profit": {"$sum": "$total"},
                        "sold": {"$sum":"$sold"}
                    }
                }
            ])

TASK 4

http://127.0.0.1:3000/books/birthDayWithPrice?totalPrice=2500&birthDate=1926-08-27T04:00:00Z
db.collection('books').aggregate([
            {
            $lookup: {
                    from: "authors",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "authorData"
                }
            },
            {
                $project:{
                "authorId": 1,
                "authorData": 1,
                "totalPrice": {"$sum": "$price"}
                }
            },
            { $unwind:{
                path: "$authorData"
                }
            },
            {
                $group:{
                "_id": "$authorId", "totalPrice": {"$sum": "$totalPrice"}, birthDate: { $first: "$authorData.birth" }
                }
            },
            {
                $match: {
                $and: [ 
                    {totalPrice: {$gte: totalPrice}}, 
                    {birthDate: {$gte: new Date(birthDate)}}
                ]
                }
            }
        ])
        
   --------THE END--------
